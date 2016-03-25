module.exports = function(api, cucumberCLITemplate, cucumberExecutable, nodeExecutable, configJSON, childProcess, guid) {
    return {
        runCukesForTags: function(arrayOfTagNamesWithoutAtSymbol) {
            var tagsString = arrayOfTagNamesWithoutAtSymbol.map(function(s) { return '@'+s; }).join(',');
            var command = cucumberCLITemplate.replace('${tags}', tagsString);
            console.log('Run the following command to execute cucumber tests:');
            console.log(command);
            console.log('');
            return command;
        },
        runMultiClusterTests: function(currentUser, clusterIds, cucumberAdditionalArgs, phase) {
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
            return api.newGroupPromise(cucumberRunConfigs.map(c=>this.runClusterTest(c, cucumberAdditionalArgs)))
                .then(clusterTestResults=>api.newMultiClusterTestResult(testRunGUID, clusterTestResults));
        },
        runClusterTest: function(cucumberRunConfig, cucumberAdditionalArgs) {
            return api.newPromise((resolve, reject) => {
                var stdoutParts = [];
                var stderrParts = [];
                var repositories = api.newRepositories(cucumberRunConfig.phase);
                var command = `${nodeExecutable} ${cucumberExecutable} -f json:${cucumberRunConfig.jsonResultFilePath} ${cucumberAdditionalArgs}`;
                var cukeProcess = childProcess.exec(
                    command,
                    { env: {
                        clusterId: cucumberRunConfig.clusterId,
                        phase: cucumberRunConfig.phase
                    }}
                );

                cukeProcess.stdout.on('data', (data) => stdoutParts.push(data));
                cukeProcess.stderr.on('data', (data) => stderrParts.push(data));
                cukeProcess.on('close', processExitCode => {
                    var clusterUnderTest = api.newClusterUnderTest(cucumberRunConfig.clusterId, repositories);
                    function cucumberResult(processExitCode, versionGraph, versionGraphError) {
                        return api.newClusterTestResult(
                            stdoutParts.join(''),
                            stderrParts.join(''),
                            processExitCode,
                            cucumberRunConfig,
                            versionGraph,
                            versionGraphError
                        );
                    }
                    //todo: load the json result file
                    clusterUnderTest.versionGraph()
                        .then(versionGraph=>resolve(cucumberResult(processExitCode, versionGraph, null)))
                        .catch(error=>resolve(cucumberResult(processExitCode, null, error)));
                });
            });
        }
    }
}