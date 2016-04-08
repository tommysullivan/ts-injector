"use strict";
var MCSRestSession = (function () {
    function MCSRestSession(authedRestClient, mcsConfiguration, mcs, typedJSON, errors) {
        this.authedRestClient = authedRestClient;
        this.mcsConfiguration = mcsConfiguration;
        this.mcs = mcs;
        this.typedJSON = typedJSON;
        this.errors = errors;
    }
    MCSRestSession.prototype.dashboardInfo = function () {
        var _this = this;
        return this.authedRestClient.post(this.mcsConfiguration.mcsDashboardInfoPath)
            .then(function (response) { return _this.mcs.newMCSDashboardInfo(_this.typedJSON.newJSONObject(response.jsonBody())); });
    };
    MCSRestSession.prototype.applicationLinkFor = function (applicationName) {
        var _this = this;
        var applicationInfoPath = this.mcsConfiguration.mcsApplicationLinkPathTemplate
            .replace('{applicationName}', applicationName);
        return this.authedRestClient.post(applicationInfoPath)
            .then(function (response) {
            var jsonResponse = _this.typedJSON.newJSONObject(response.jsonBody());
            try {
                return jsonResponse.listOfJSONObjectsNamed('data').first().stringPropertyNamed('url');
            }
            catch (e) {
                throw _this.errors.newErrorWithCause(e, "mcs link json format was bad - " + jsonResponse.toString());
            }
        });
    };
    return MCSRestSession;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MCSRestSession;
//# sourceMappingURL=mcs-rest-session.js.map