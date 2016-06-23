"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ErrorWithCause = (function (_super) {
    __extends(ErrorWithCause, _super);
    function ErrorWithCause(message, cause) {
        _super.call(this, message);
        this.__message = message;
        this.cause = cause;
    }
    Object.defineProperty(ErrorWithCause.prototype, "message", {
        get: function () {
            return _super.prototype.message + " - caused by " + this.causeMessage;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ErrorWithCause.prototype, "causeMessage", {
        get: function () {
            return this.cause.stack
                ? this.cause.stack.split("\n")
                : this.cause.toJSON
                    ? this.cause.toJSON()
                    : this.cause.toString();
        },
        enumerable: true,
        configurable: true
    });
    ErrorWithCause.prototype.toString = function () {
        return JSON.stringify(this.toJSON(), null, 3);
    };
    ErrorWithCause.prototype.toJSON = function () {
        return {
            message: this.__message,
            cause: this.causeMessage
        };
    };
    return ErrorWithCause;
}(Error));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ErrorWithCause;
//# sourceMappingURL=error-with-cause.js.map