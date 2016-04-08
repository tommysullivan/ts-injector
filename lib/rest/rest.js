"use strict";
var rest_response_1 = require("./rest-response");
var rest_client_as_promised_1 = require("./rest-client-as-promised");
var rest_error_1 = require("./rest-error");
var Rest = (function () {
    function Rest(promiseFactory, requestModule, restConfiguration, typedJSON) {
        this.promiseFactory = promiseFactory;
        this.requestModule = requestModule;
        this.restConfiguration = restConfiguration;
        this.typedJSON = typedJSON;
    }
    Rest.prototype.newRestClientAsPromised = function (baseURL) {
        return new rest_client_as_promised_1.default(this.promiseFactory, this.newJSONRequestorWithCookies(), baseURL, this);
    };
    Rest.prototype.newJSONRequestorWithCookies = function () {
        this.requestModule.debug = this.restConfiguration.debugHTTP;
        return this.requestModule.defaults({
            jar: true,
            agentOptions: {
                rejectUnauthorized: false
            },
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
    };
    Rest.prototype.newRestResponse = function (error, nativeResponse, originalURL) {
        return new rest_response_1.default(error, nativeResponse, originalURL, this.typedJSON);
    };
    Rest.prototype.newRestError = function (restResponse) {
        return new rest_error_1.default(restResponse);
    };
    return Rest;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Rest;
//# sourceMappingURL=rest.js.map