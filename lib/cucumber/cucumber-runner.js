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
        runClusterTest: function(cucumberRunConfig, cucumberAdditionalArgs, features) {
            return api.newPromise((resolve, reject) => {
                var stdoutParts = [];
                var stderrParts = [];
                var repositories = api.newRepositories(cucumberRunConfig.phase);
                var command = `${nodeExecutable} ${cucumberExecutable} ${features.join(' ')} -f json:${cucumberRunConfig.jsonResultFilePath} ${cucumberAdditionalArgs}`;
                var environmentVariables = {
                    PATH: process.execPath,
                    clusterId: cucumberRunConfig.clusterId,
                    phase: cucumberRunConfig.phase
                }
                var cukeProcess = childProcess.exec(
                    command,
                    { env: environmentVariables }
                );
                console.log('cucumber command: ',command);
                console.log('environment variables: ',JSON.stringify(environmentVariables, null, 3));

                cukeProcess.stdout.on('data', (data) => { process.stdout.write('.'); stdoutParts.push(data) });
                cukeProcess.stderr.on('data', (data) => { process.stdout.write('E'); stderrParts.push(data) });
                cukeProcess.on('close', processExitCode => {
                    var clusterUnderTest = api.newClusterUnderTest(cucumberRunConfig.clusterId, repositories);
                    function cucumberResult(resultJSON, processExitCode, versionGraph, versionGraphError) {
                        return api.newClusterTestResult(
                            resultJSON,
                            stdoutParts.join(''),
                            stderrParts.join(''),
                            processExitCode,
                            cucumberRunConfig,
                            versionGraph,
                            versionGraphError
                        );
                    }
                    var resultJSON = require(`../../${cucumberRunConfig.jsonResultFilePath}`);
                    clusterUnderTest.versionGraph()
                        .then(versionGraph=>resolve(cucumberResult(resultJSON, processExitCode, versionGraph, null)))
                        .catch(error=>resolve(cucumberResult(resultJSON, processExitCode, null, error)));
                });
            });
        }
    }
}