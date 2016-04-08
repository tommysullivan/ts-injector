"use strict";
var SpyglassHealthChecker = (function () {
    function SpyglassHealthChecker(spyglassHealthCheckServiceNames, errors) {
        this.spyglassHealthCheckServiceNames = spyglassHealthCheckServiceNames;
        this.errors = errors;
    }
    SpyglassHealthChecker.prototype.unhealthySpyglassServiceNamesAccordingToMCS = function (mcsDashboardInfo) {
        var _this = this;
        return this.spyglassHealthCheckServiceNames.filter(function (serviceName) { return _this.serviceIsUnhealthy(mcsDashboardInfo, serviceName); });
    };
    SpyglassHealthChecker.prototype.serviceIsUnhealthy = function (mcsDashboardInfo, serviceName) {
        try {
            return !mcsDashboardInfo.services().firstWhere(function (s) { return s.name == serviceName; }).isHealthy;
        }
        catch (e) {
            return true;
        }
    };
    return SpyglassHealthChecker;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SpyglassHealthChecker;
//# sourceMappingURL=spyglass-health-checker.js.map