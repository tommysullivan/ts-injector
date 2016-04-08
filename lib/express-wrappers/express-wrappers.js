"use strict";
var express_application_1 = require("./express-application");
var express_http_request_wrapper_1 = require("./express-http-request-wrapper");
var express_http_response_wrapper_1 = require("./express-http-response-wrapper");
var ExpressWrappers = (function () {
    function ExpressWrappers(nativeExpressModule, promiseFactory, bodyParser, http, typedJSON, collections) {
        this.nativeExpressModule = nativeExpressModule;
        this.promiseFactory = promiseFactory;
        this.bodyParser = bodyParser;
        this.http = http;
        this.typedJSON = typedJSON;
        this.collections = collections;
    }
    ExpressWrappers.prototype.newExpressHttpRequest = function (nativeExpressHttpRequest) {
        return new express_http_request_wrapper_1.default(nativeExpressHttpRequest, this.typedJSON, this.collections);
    };
    ExpressWrappers.prototype.newExpressHttpResponse = function (nativeExpressHttpResponse) {
        return new express_http_response_wrapper_1.default(nativeExpressHttpResponse);
    };
    ExpressWrappers.prototype.newExpressApplication = function () {
        return new express_application_1.default(this.bodyParser, this.nativeExpressModule, this.nativeExpressModule(), this.promiseFactory, this.http, this);
    };
    return ExpressWrappers;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ExpressWrappers;
//# sourceMappingURL=express-wrappers.js.map