"use strict";
var error_with_cause_1 = require("./error-with-cause");
var error_with_json_details_1 = require("./error-with-json-details");
var Errors = (function () {
    function Errors() {
    }
    Errors.prototype.newErrorWithCause = function (cause, optionalMessage) {
        return new error_with_cause_1.default(optionalMessage, cause);
    };
    Errors.prototype.newErrorWithJSONDetails = function (message, jsonDetails) {
        return new error_with_json_details_1.default(message, jsonDetails);
    };
    return Errors;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Errors;
//# sourceMappingURL=errors.js.map