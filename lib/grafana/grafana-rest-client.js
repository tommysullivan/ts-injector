"use strict";
var GrafanaRestClient = (function () {
    function GrafanaRestClient(grafana, grafanaHostAndOptionalPort, grafanaLoginPath, defaultUsername, defaultPassword, rest) {
        this.grafana = grafana;
        this.grafanaHostAndOptionalPort = grafanaHostAndOptionalPort;
        this.grafanaLoginPath = grafanaLoginPath;
        this.defaultUsername = defaultUsername;
        this.defaultPassword = defaultPassword;
        this.rest = rest;
    }
    GrafanaRestClient.prototype.createAutheticatedSessionWithDefaultCredentials = function () {
        return this.createAutheticatedSession(this.defaultUsername, this.defaultPassword);
    };
    GrafanaRestClient.prototype.createAutheticatedSession = function (username, password) {
        var _this = this;
        var restClientAsPromised = this.rest.newRestClientAsPromised(this.grafanaHostAndOptionalPort);
        var postPayload = {
            body: {
                user: username,
                email: '',
                password: password
            },
            json: true
        };
        return restClientAsPromised.post(this.grafanaLoginPath, postPayload)
            .then(function (_) { return _this.grafana.newRestSession(restClientAsPromised); });
    };
    return GrafanaRestClient;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GrafanaRestClient;
//# sourceMappingURL=grafana-rest-client.js.map