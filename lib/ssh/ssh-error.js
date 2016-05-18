"use strict";
var SSHError = (function () {
    function SSHError(message, sshResult) {
        var e = new Error();
        this._stack = e.stack;
        this._sshResult = sshResult;
        this._message = message;
    }
    Object.defineProperty(SSHError.prototype, "message", {
        get: function () { return this._message; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SSHError.prototype, "sshResult", {
        get: function () { return this._sshResult; },
        enumerable: true,
        configurable: true
    });
    SSHError.prototype.toJSON = function () {
        return {
            message: this.message,
            sshResult: (this.sshResult ? this.sshResult.toJSON() : null),
            stack: this._stack.split("\n")
        };
    };
    SSHError.prototype.toJSONString = function () {
        return JSON.stringify(this.toJSON(), null, 3);
    };
    SSHError.prototype.toString = function () {
        return this.toJSONString();
    };
    return SSHError;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SSHError;
//# sourceMappingURL=ssh-error.js.map