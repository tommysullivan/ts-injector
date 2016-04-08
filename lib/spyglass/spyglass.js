"use strict";
var spyglass_health_checker_1 = require("./spyglass-health-checker");
var Spyglass = (function () {
    function Spyglass(spyglassConfig, errors) {
        this.spyglassConfig = spyglassConfig;
        this.errors = errors;
    }
    Spyglass.prototype.newSpyglassHealthChecker = function () {
        return new spyglass_health_checker_1.default(this.spyglassConfig.spyglassHealthCheckServiceNames, this.errors);
    };
    return Spyglass;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Spyglass;
//# sourceMappingURL=spyglass.js.map