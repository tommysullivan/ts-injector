module.exports = function(stdout, stderr, processExitCode, cucumberRunConfig, versionGraph, versionGraphError) {
    return {
        toJSON: function() {
            return {
                stdout: stdout,
                stderr: stderr,
                processExitCode: processExitCode,
                cucumberRunConfig: cucumberRunConfig,
                versionGraph: versionGraph,
                versionGraphError: versionGraphError,
                passed: this.passed()
            }
        },
        passed: function() {
            return processExitCode==0;
        },
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