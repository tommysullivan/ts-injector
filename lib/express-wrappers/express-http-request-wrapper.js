"use strict";
var ExpressHttpRequestWrapper = (function () {
    function ExpressHttpRequestWrapper(nativeExpressHttpRequest, typedJSON, collections) {
        this.nativeExpressHttpRequest = nativeExpressHttpRequest;
        this.typedJSON = typedJSON;
        this.collections = collections;
    }
    ExpressHttpRequestWrapper.prototype.accepts = function (contentType) {
        return this.nativeExpressHttpRequest.accepts(contentType);
    };
    Object.defineProperty(ExpressHttpRequestWrapper.prototype, "bodyAsJSONObject", {
        get: function () {
            return this.typedJSON.newJSONObject(this.body);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExpressHttpRequestWrapper.prototype, "bodyAsListOfJSONObjects", {
        get: function () {
            var _this = this;
            return this.collections.newList(this.body).map(function (i) { return _this.typedJSON.newJSONObject(i); });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExpressHttpRequestWrapper.prototype, "body", {
        get: function () {
            return this.nativeExpressHttpRequest.body;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExpressHttpRequestWrapper.prototype, "params", {
        get: function () {
            return this.collections.newDictionary(this.nativeExpressHttpRequest.params);
        },
        enumerable: true,
        configurable: true
    });
    return ExpressHttpRequestWrapper;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ExpressHttpRequestWrapper;
//# sourceMappingURL=express-http-request-wrapper.js.map