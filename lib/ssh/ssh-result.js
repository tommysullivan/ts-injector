"use strict";
var SSHResult = (function () {
    function SSHResult(host, processResult) {
        this._host = host;
        this._processResult = processResult;
    }
    SSHResult.prototype.host = function () {
        return this._host;
    };
    SSHResult.prototype.processResult = function () {
        return this._processResult;
    };
    SSHResult.prototype.toJSON = function () {
        return {
            host: this.host(),
            processResult: this.processResult().toJSON()
        };
    };
    SSHResult.prototype.toString = function () {
        return this.toJSONString();
    };
    SSHResult.prototype.toJSONString = function () {
        return JSON.stringify(this.toJSON(), null, 3);
    };
    return SSHResult;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SSHResult;
//# sourceMappingURL=ssh-result.js.map