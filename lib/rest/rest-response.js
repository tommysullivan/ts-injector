"use strict";
var RestResponse = (function () {
    function RestResponse(error, nativeResponse, originalUrl, typedJSON) {
        this.error = error;
        this.nativeResponse = nativeResponse;
        this._originalUrl = originalUrl;
        this.typedJSON = typedJSON;
    }
    RestResponse.prototype.toString = function () {
        return JSON.stringify(this.toJSON(), null, 3);
    };
    RestResponse.prototype.toJSON = function () {
        var body = this.isJSON() ? this.jsonBody() : this.body();
        return {
            originalURL: this._originalUrl,
            type: 'rest-response',
            error: this.error,
            statusCode: this.statusCode(),
            body: body
        };
    };
    RestResponse.prototype.isError = function () {
        return this.error || this.nativeResponse.statusCode >= 400;
    };
    RestResponse.prototype.body = function () {
        return (this.nativeResponse || {}).body;
    };
    RestResponse.prototype.isJSON = function () {
        try {
            this.jsonBody();
            return true;
        }
        catch (e) {
            return false;
        }
    };
    RestResponse.prototype.originalUrl = function () {
        return this._originalUrl;
    };
    RestResponse.prototype.jsonBody = function () {
        return JSON.parse(this.body());
    };
    RestResponse.prototype.bodyAsJsonObject = function () {
        return this.typedJSON.newJSONObject(this.jsonBody());
    };
    RestResponse.prototype.statusCode = function () {
        return (this.nativeResponse || {}).statusCode;
    };
    return RestResponse;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RestResponse;
//# sourceMappingURL=rest-response.js.map