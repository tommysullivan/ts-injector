module.exports = function(command, shellExecutionError, processExitCode, stdout, stderr) {
    return {
        stdoutLines: function() {
            return stdout.split("\n");
        },
        stderrLines: function() {
            return stderr.split("\n");
        },
        toString: function() {
            return JSON.stringify(this.toJSON(), null, 3);
        },
        processExitCode: () => processExitCode,
        toJSON: function() {
            return {
                command: command,
                shellExecutionError: shellExecutionError,
                processExitCode: processExitCode,
                stdout: stdout,
                stderr: stderr,
                stdoutLines: this.stdoutLines(),
                strerrLines: this.stderrLines()
            }
        }
    }
}