"use strict";
var ErrorWithJSONDetails = (function () {
    function ErrorWithJSONDetails(message, detailJSON) {
        this.message = message;
        this.detailJSON = detailJSON;
    }
    ErrorWithJSONDetails.prototype.toJSON = function () {
        return {
            message: this.message,
            detailJSON: this.detailJSON
        };
    };
    ErrorWithJSONDetails.prototype.toString = function () {
        return JSON.stringify(this.toJSON());
    };
    return ErrorWithJSONDetails;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ErrorWithJSONDetails;
//# sourceMappingURL=error-with-json-details.js.map