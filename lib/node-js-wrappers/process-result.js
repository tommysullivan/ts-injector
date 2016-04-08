"use strict";
var ProcessResult = (function () {
    function ProcessResult(command, processExitCode, stdoutLines, stderrLines, shellInvocationError) {
        this._command = command;
        this._processExitCode = processExitCode;
        this._stdoutLines = stdoutLines;
        this._stderrLines = stderrLines;
        this._shellInvocationError = shellInvocationError;
    }
    ProcessResult.prototype.shellInvocationError = function () {
        return this._shellInvocationError;
    };
    ProcessResult.prototype.command = function () {
        return this._command;
    };
    ProcessResult.prototype.hasError = function () {
        return this.processExitCode() != 0;
    };
    ProcessResult.prototype.processExitCode = function () {
        return this._processExitCode;
    };
    ProcessResult.prototype.toString = function () {
        return JSON.stringify(this.toJSON(), null, 3);
    };
    ProcessResult.prototype.stdoutLines = function () {
        return this._stdoutLines;
    };
    ProcessResult.prototype.stderrLines = function () {
        return this._stderrLines;
    };
    ProcessResult.prototype.toJSON = function () {
        return {
            command: this.command(),
            processExitCode: this.processExitCode(),
            stdoutLines: this.stdoutLines().toJSON(),
            stderrLines: this.stderrLines().toJSON(),
            shellInvocationError: this.shellInvocationError()
        };
    };
    ProcessResult.prototype.toJSONString = function () {
        return JSON.stringify(this.toJSON(), null, 3);
    };
    return ProcessResult;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ProcessResult;
//# sourceMappingURL=process-result.js.map