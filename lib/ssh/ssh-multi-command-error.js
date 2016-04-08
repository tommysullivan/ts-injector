"use strict";
var SSHMultiCommandError = (function () {
    function SSHMultiCommandError(sshResults) {
        this.sshResults = sshResults;
    }
    Object.defineProperty(SSHMultiCommandError.prototype, "message", {
        get: function () {
            return this.toString();
        },
        enumerable: true,
        configurable: true
    });
    SSHMultiCommandError.prototype.toJSON = function () {
        return {
            message: this.message,
            sshResults: this.sshResults.toJSON()
        };
    };
    SSHMultiCommandError.prototype.toString = function () {
        return "SSHMultiCommandError - " + this.toJSONString();
    };
    SSHMultiCommandError.prototype.toJSONString = function () {
        return JSON.stringify(this.toJSON(), null, 3);
    };
    return SSHMultiCommandError;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SSHMultiCommandError;
//# sourceMappingURL=ssh-multi-command-error.js.map