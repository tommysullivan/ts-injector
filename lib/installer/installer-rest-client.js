"use strict";
var InstallerRestClient = (function () {
    function InstallerRestClient(installer, configuration, rest, typedJSON) {
        this.installer = installer;
        this.configuration = configuration;
        this.rest = rest;
        this.typedJSON = typedJSON;
    }
    InstallerRestClient.prototype.apiLink = function (httpResponse, linkName) {
        return httpResponse.jsonBody().links[linkName];
    };
    InstallerRestClient.prototype.createAutheticatedSession = function (installerProtocolHostAndOptionalPort, username, password) {
        var _this = this;
        var restClientAsPromised = this.rest.newRestClientAsPromised(installerProtocolHostAndOptionalPort);
        var loginBody = {
            form: {
                username: username,
                password: password
            }
        };
        return restClientAsPromised.post(this.configuration.installerLoginPath, loginBody)
            .then(function (loginResponse) { return restClientAsPromised.get(_this.configuration.installerAPIPath); })
            .then(function (apiResponse) {
            return _this.installer.newInstallerRestSession(restClientAsPromised, _this.typedJSON.newJSONObject(apiResponse.jsonBody()));
        });
    };
    return InstallerRestClient;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = InstallerRestClient;
//# sourceMappingURL=installer-rest-client.js.map