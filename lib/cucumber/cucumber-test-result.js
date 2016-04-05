module.exports = function(resultJSON,
                          jsonResultError,
                          processExitCode,
                          jsonPath,
                          environmentVariables,
                          cucumberAdditionalArgs,
                          stdout,
                          stderr) {
    return {
        resultJSON: () => resultJSON,
        jsonResultError: () => jsonResultError,
        processExitCode: () => processExitCode,
        jsonPath: () => jsonPath,
        environmentVariables: () => environmentVariables,
        cucumberAdditionalArgs: () => cucumberAdditionalArgs,
        stdout: () => stdout,
        stderr: () => stderr,
        passed: () => processExitCode == 0 && jsonResultError == null,
        toJSON: () => {
            return {
                resultJSON: resultJSON,
                jsonResultError:jsonResultError,
                processExitCode:processExitCode,
                jsonPath:jsonPath,
                environmentVariables:environmentVariables,
                cucumberAdditionalArgs:cucumberAdditionalArgs,
                stdoutLines:stdout.split("\n"),
                stderrLines:stderr.split("\n")
            }
        },
        toString: function() {
            return JSON.stringify(this.toJSON(), null, 3);
        }
    }
}