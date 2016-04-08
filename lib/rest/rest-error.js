"use strict";
var RestError = (function () {
    function RestError(restResponse) {
        this.restResponse = restResponse;
    }
    Object.defineProperty(RestError.prototype, "message", {
        get: function () {
            return this.toString();
        },
        enumerable: true,
        configurable: true
    });
    RestError.prototype.toJSON = function () {
        return {
            restResponse: this.restResponse.toJSON()
        };
    };
    RestError.prototype.toString = function () {
        return "RestError - " + JSON.stringify(this.toJSON(), null, 3);
    };
    return RestError;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RestError;
//# sourceMappingURL=rest-error.js.map