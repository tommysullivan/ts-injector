"use strict";
var grafana_rest_session_1 = require("./grafana-rest-session");
var grafana_rest_client_1 = require("./grafana-rest-client");
var Grafana = (function () {
    function Grafana(configJSON, fileSystem, rest) {
        this.configJSON = configJSON;
        this.fileSystem = fileSystem;
        this.rest = rest;
    }
    Grafana.prototype.newRestSession = function (authedRestClient) {
        return new grafana_rest_session_1.default(authedRestClient, this.configJSON.stringPropertyNamed('grafanaDashboardImportPath'), this.fileSystem);
    };
    Grafana.prototype.newGrafanaRestClient = function () {
        return new grafana_rest_client_1.default(this, this.configJSON.stringPropertyNamed('grafanaHostAndOptionalPort'), this.configJSON.stringPropertyNamed('grafanaLoginPath'), this.configJSON.stringPropertyNamed('defaultGrafanaUsername'), this.configJSON.stringPropertyNamed('defaultGrafanaPassword'), this.rest);
    };
    return Grafana;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Grafana;
//# sourceMappingURL=grafana.js.map