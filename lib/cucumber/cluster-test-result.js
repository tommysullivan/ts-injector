module.exports = function(resultJSON, stdout, stderr, processExitCode, cucumberRunConfig, versionGraph, versionGraphError) {
    return {
        toJSON: function() {
            return {
                contentType: 'vnd/mapr.test-portal.cluster-test-result+json;v=1.0.0',
                resultJSON: resultJSON,
                stdoutLines: stdout.split("\n"),
                stderrLines: stderr.split("\n"),
                processExitCode: processExitCode,
                cucumberRunConfig: cucumberRunConfig,
                versionGraph: versionGraph,
                versionGraphError: versionGraphError,
                passed: this.passed()
            }
        },
        toString: function() {
            return JSON.stringify(this.toJSON(), null, 3);
        },
        jsonResultFilePath: () => cucumberRunConfig.jsonResultFilePath,
        passed: () => processExitCode==0,
        toPrettyString: function() {
            var line = Array(80).join('~');
            return [
                line,
                `Cluster Result clusterId: ${cucumberRunConfig.clusterId}, phase: ${cucumberRunConfig.phase} - ${this.passed()?'passed':'failed'}`,
                line,
                stdout
            ].join("\n");
        }
    }

}