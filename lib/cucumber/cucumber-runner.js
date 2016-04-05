module.exports = function(api, cucumberCLITemplate, cucumberExecutable, nodeExecutable, configJSON, childProcess, guid, fs) {
    return {
        runCukesForTags: function(arrayOfTagNamesWithoutAtSymbol) {
            var tagsString = arrayOfTagNamesWithoutAtSymbol.map(function(s) { return '@'+s; }).join(',');
            var command = cucumberCLITemplate.replace('${tags}', tagsString);
            console.log('Run the following command to execute cucumber tests:');
            console.log(command);
            console.log('');
            return command;
        },
        runMultiClusterTests: function(currentUser, clusterIds, cucumberAdditionalArgs, phase, features) {
            var testRunGUID = guid.raw();
            var dateTimeStamp = new Date().toISOString().replace(/:/g,'-');
            var cucumberRunConfigs = clusterIds.map(clusterId=> {
                return {
                    testRunGUID: testRunGUID,
                    clusterId: clusterId,
                    flattenedClusterConfig: api.flattenedConfigForClusterId(clusterId),
                    jsonResultFilePath: `test-results/${testRunGUID}_${clusterId}_phase-${phase}_user-${currentUser}.json`,
                    phase: phase,
                    user: currentUser,
                    timestamp: dateTimeStamp,
                    configJSON: configJSON
                }
            });
            return api.newGroupPromise(cucumberRunConfigs.map(c=>this.runClusterTest(c, cucumberAdditionalArgs, features)))
                .then(clusterTestResults=>api.newMultiClusterTestResult(testRunGUID, clusterTestResults));
        },
        runCucumber: function(jsonResultFilePath, environmentVariables, cucumberAdditionalArgs) {
            environmentVariables.PATH = process.execPath;
            var jsonPath = `../../${jsonResultFilePath}`;
            return api.newPromise((resolve, reject) => {
                var stdoutParts = [];
                var stderrParts = [];
                var command = `${nodeExecutable} ${cucumberExecutable} ${cucumberAdditionalArgs} -f json:${jsonResultFilePath}`;
                console.log('cucumber command: ',command);
                console.log('environment variables: ',JSON.stringify(environmentVariables, null, 3));
                var cukeProcess = childProcess.exec(
                    command,
                    { env: environmentVariables }
                );
                cukeProcess.stdout.on('data', (data) => { process.stdout.write('.'); stdoutParts.push(data) });
                cukeProcess.stderr.on('data', (data) => { process.stdout.write('E'); stderrParts.push(data) });
                cukeProcess.on('close', processExitCode => {
                    var resultJSON = [];
                    var jsonResultError = null;
                    try {
                        resultJSON = require(jsonPath);
                    }
                    catch(e) {
                        jsonResultError = e;
                    }
                    var cucumberTestResult = api.newCucumberTestResult(
                        resultJSON,
                        jsonResultError,
                        processExitCode,
                        jsonPath,
                        environmentVariables,
                        cucumberAdditionalArgs,
                        stdoutParts.join(''),
                        stderrParts.join('')
                    );
                    resolve(cucumberTestResult);
                });
            });
        },
        runClusterTest: function(cucumberRunConfig, cucumberAdditionalArgs, features) {
            var environmentVariables = {
                clusterId: cucumberRunConfig.clusterId,
                phase: cucumberRunConfig.phase
            }
            var featuresPlusAdditionalArgs = `${features.join(' ')} ${cucumberAdditionalArgs}`;
            var repositories = api.newRepositories(cucumberRunConfig.phase);
            function newClusterTestResult(cucumberTestResult, versionGraph, versionGraphError) {
                return api.newClusterTestResult(
                    cucumberTestResult.resultJSON(),
                    cucumberTestResult.stdout(),
                    cucumberTestResult.stderr(),
                    cucumberTestResult.processExitCode(),
                    cucumberRunConfig,
                    versionGraph,
                    versionGraphError
                );
            }
            return this.runCucumber(cucumberRunConfig.jsonResultFilePath, environmentVariables, featuresPlusAdditionalArgs)
                .then(cucumberTestResult => {
                    var clusterUnderTest = api.newClusterUnderTest(cucumberRunConfig.clusterId, repositories);
                    return clusterUnderTest.versionGraph()
                        .then(versionGraph=>newClusterTestResult(cucumberTestResult, versionGraph, null))
                        .catch(error=>newClusterTestResult(cucumberTestResult, null, error));
                });

        }
    }
}