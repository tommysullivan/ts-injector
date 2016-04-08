"use strict";
var ErrorWithCause = (function () {
    function ErrorWithCause(message, cause) {
        this._message = message;
        this.cause = cause;
    }
    Object.defineProperty(ErrorWithCause.prototype, "message", {
        get: function () {
            return this._message;
        },
        enumerable: true,
        configurable: true
    });
    ErrorWithCause.prototype.toString = function () {
        return JSON.stringify(this.toJSON(), null, 3);
    };
    ErrorWithCause.prototype.toJSON = function () {
        return {
            message: this.message,
            cause: this.cause.stack
                ? this.cause.stack.split("\n")
                : this.cause.toJSON
                    ? this.cause.toJSON()
                    : this.cause.toString()
        };
    };
    return ErrorWithCause;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ErrorWithCause;
//# sourceMappingURL=error-with-cause.js.map