"use strict";
var ExpressHttpResponseWrapper = (function () {
    function ExpressHttpResponseWrapper(nativeExpressHttpResponse) {
        this.nativeExpressHttpResponse = nativeExpressHttpResponse;
    }
    ExpressHttpResponseWrapper.prototype.sendStatus = function (code) {
        this.nativeExpressHttpResponse.sendStatus(code);
        return this;
    };
    ExpressHttpResponseWrapper.prototype.end = function (content) {
        this.nativeExpressHttpResponse.end(content);
    };
    ExpressHttpResponseWrapper.prototype.redirect = function (url) {
        this.nativeExpressHttpResponse.redirect(url);
    };
    ExpressHttpResponseWrapper.prototype.on = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        return (_a = this.nativeExpressHttpResponse).on.apply(_a, args);
        var _a;
    };
    ExpressHttpResponseWrapper.prototype.dest = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        return (_a = this.nativeExpressHttpResponse).dest.apply(_a, args);
        var _a;
    };
    ExpressHttpResponseWrapper.prototype.once = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        return (_a = this.nativeExpressHttpResponse).once.apply(_a, args);
        var _a;
    };
    ExpressHttpResponseWrapper.prototype.write = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        return (_a = this.nativeExpressHttpResponse).write.apply(_a, args);
        var _a;
    };
    ExpressHttpResponseWrapper.prototype.removeListener = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        return (_a = this.nativeExpressHttpResponse).removeListener.apply(_a, args);
        var _a;
    };
    ExpressHttpResponseWrapper.prototype.emit = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        return (_a = this.nativeExpressHttpResponse).emit.apply(_a, args);
        var _a;
    };
    return ExpressHttpResponseWrapper;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ExpressHttpResponseWrapper;
//# sourceMappingURL=express-http-response-wrapper.js.map