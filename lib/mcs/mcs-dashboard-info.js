"use strict";
var MCSDashboardInfo = (function () {
    function MCSDashboardInfo(dashboardInfoJSONObject, mcs) {
        this.dashboardInfoJSONObject = dashboardInfoJSONObject;
        this.mcs = mcs;
    }
    MCSDashboardInfo.prototype.services = function () {
        var _this = this;
        var dataJSONObject = this.dashboardInfoJSONObject.listOfJSONObjectsNamed('data').first();
        var servicesDictionary = dataJSONObject.dictionaryNamed('services');
        return servicesDictionary.keys.map(function (serviceName) { return _this.mcs.newMCSServiceInfo(serviceName, dataJSONObject.jsonObjectNamed('services').jsonObjectNamed(serviceName)); });
    };
    MCSDashboardInfo.prototype.toJSON = function () { return this.dashboardInfoJSONObject.toRawJSON(); };
    MCSDashboardInfo.prototype.toString = function () { return this.dashboardInfoJSONObject.toString(); };
    return MCSDashboardInfo;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MCSDashboardInfo;
//# sourceMappingURL=mcs-dashboard-info.js.map