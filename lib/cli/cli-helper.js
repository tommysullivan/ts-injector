"use strict";
var CliHelper = (function () {
    function CliHelper(process, console, clusterTesting, clusters) {
        this.process = process;
        this.console = console;
        this.clusterTesting = clusterTesting;
        this.clusters = clusters;
    }
    CliHelper.prototype.logError = function (e) {
        this.console.log(e.stack ? e.stack : e.toJSONString ? e.toJSONString() : e.toString());
    };
    CliHelper.prototype.verifyFillerWord = function (fillerWord, position) {
        var errorMessage = "expected clarifying word \"" + fillerWord + "\"";
        var val = this.process.getArgvOrThrow(errorMessage, position);
        if (fillerWord != val)
            throw new Error(errorMessage + " in position " + position);
    };
    return CliHelper;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CliHelper;
//# sourceMappingURL=cli-helper.js.map