"use strict";
var ErrorHandler = (function () {
    function ErrorHandler(console) {
        this.console = console;
    }
    ErrorHandler.prototype.handleError = function (httpResponse, error) {
        httpResponse.sendStatus(500).end("An error occurred: " + error.toString());
    };
    return ErrorHandler;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ErrorHandler;
//# sourceMappingURL=error-handler.js.map