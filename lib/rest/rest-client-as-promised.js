"use strict";
var RestClientAsPromised = (function () {
    function RestClientAsPromised(promiseFactory, requestor, baseUrl, rest) {
        this.promiseFactory = promiseFactory;
        this.requestor = requestor;
        this.baseUrl = baseUrl;
        this.rest = rest;
    }
    RestClientAsPromised.prototype.post = function (path, options) {
        return this.request(this.requestor.post, path, options);
    };
    RestClientAsPromised.prototype.get = function (path, options) {
        return this.request(this.requestor.get, path, options);
    };
    RestClientAsPromised.prototype.patch = function (path, options) {
        return this.request(this.requestor.patch, path, options);
    };
    RestClientAsPromised.prototype.delete = function (path, options) {
        return this.request(this.requestor.delete, path, options);
    };
    RestClientAsPromised.prototype.put = function (path, options) {
        return this.request(this.requestor.put, path, options);
    };
    RestClientAsPromised.prototype.request = function (method, path, options) {
        var _this = this;
        var url = path.indexOf('://') >= 0 ? path : this.baseUrl + path;
        return this.promiseFactory.newPromise(function (resolve, reject) {
            var responseHandler = function (error, response, body) {
                var responseWrapper = _this.rest.newRestResponse(error, response, url);
                if (responseWrapper.isError())
                    reject(_this.rest.newRestError(responseWrapper));
                else
                    resolve(responseWrapper);
            };
            method.call(_this.requestor, url, options, responseHandler.bind(_this));
        });
    };
    return RestClientAsPromised;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RestClientAsPromised;
//# sourceMappingURL=rest-client-as-promised.js.map