"use strict";
var mcs_rest_client_1 = require("./mcs-rest-client");
var mcs_rest_session_1 = require("./mcs-rest-session");
var mcs_dashboard_info_1 = require("./mcs-dashboard-info");
var mcs_service_info_1 = require("./mcs-service-info");
var MCS = (function () {
    function MCS(mcsConfiguration, rest, typedJSON, errors) {
        this.mcsConfiguration = mcsConfiguration;
        this.rest = rest;
        this.typedJSON = typedJSON;
        this.errors = errors;
    }
    MCS.prototype.newMCSClient = function (host) {
        var url = this.mcsConfiguration.mcsUrlTemplate.replace('{host}', host);
        return new mcs_rest_client_1.default(this.rest, url, this.mcsConfiguration.mcsLoginPath, this);
    };
    MCS.prototype.newMCSRestSession = function (authedRestClient) {
        return new mcs_rest_session_1.default(authedRestClient, this.mcsConfiguration, this, this.typedJSON, this.errors);
    };
    MCS.prototype.newMCSDashboardInfo = function (dashboardInfoJSONObject) {
        return new mcs_dashboard_info_1.default(dashboardInfoJSONObject, this);
    };
    MCS.prototype.newMCSServiceInfo = function (name, serviceJSONObject) {
        return new mcs_service_info_1.default(name, serviceJSONObject);
    };
    return MCS;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MCS;
//# sourceMappingURL=mcs.js.map