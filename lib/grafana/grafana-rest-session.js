"use strict";
var GrafanaRestSession = (function () {
    function GrafanaRestSession(authedRestClient, grafanaDashboardImportPath, fileSystem) {
        this.authedRestClient = authedRestClient;
        this.grafanaDashboardImportPath = grafanaDashboardImportPath;
        this.fileSystem = fileSystem;
    }
    GrafanaRestSession.prototype.uploadGrafanaDashboard = function (dashboardName, fqdns) {
        //TODO: Replace dashboard JSON fqdns with those passed in as an arg
        //TODO: Determine why we receive 404 here
        var dashboardJSON = this.fileSystem.readFileSync("../../dashboards/" + dashboardName + "_dashboard.json");
        var postPayload = {
            body: {
                dashboard: dashboardJSON,
                overwrite: false
            },
            json: true
        };
        return this.authedRestClient.post(this.grafanaDashboardImportPath, postPayload);
    };
    return GrafanaRestSession;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GrafanaRestSession;
//# sourceMappingURL=grafana-rest-session.js.map