"use strict";
var spyglass_health_checker_1 = require("./spyglass-health-checker");
var Spyglass = (function () {
    function Spyglass(errors, packageSets, releasePhase) {
        this.errors = errors;
        this.packageSets = packageSets;
        this.releasePhase = releasePhase;
    }
    Spyglass.prototype.newSpyglassHealthChecker = function () {
        var healthCheckablePackageNames = this.packageSets.all.firstWhere(function (p) { return p.id == 'healthCheckable'; }).packages.map(function (p) { return p.name; });
        var spyglassPackageNames = this.releasePhase.packages.where(function (p) { return p.tags.contain('spyglass'); }).map(function (p) { return p.name; });
        var healthCheckableSpyglassPackageNames = spyglassPackageNames.where(function (packageName) { return healthCheckablePackageNames.contain(packageName); });
        return new spyglass_health_checker_1.default(healthCheckableSpyglassPackageNames, this.errors);
    };
    return Spyglass;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Spyglass;
//# sourceMappingURL=spyglass.js.map