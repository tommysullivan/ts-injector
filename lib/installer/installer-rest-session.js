"use strict";
var InstallerRestSession = (function () {
    function InstallerRestSession(authedRestClient, installer, clientConfiguration, installerAPIJSON, typedJSON) {
        this.authedRestClient = authedRestClient;
        this.installer = installer;
        this.clientConfiguration = clientConfiguration;
        this.installerAPIJSON = installerAPIJSON;
        this.typedJSON = typedJSON;
    }
    InstallerRestSession.prototype.configuration = function () {
        var _this = this;
        return this.authedRestClient.get(this.serverConfigResourceURL)
            .then(function (response) { return _this.installer.newInstallerServerConfiguration(_this.typedJSON.newJSONObject(response.jsonBody()), _this.authedRestClient, _this.serverConfigResourceURL); });
    };
    InstallerRestSession.prototype.linkNamed = function (name) {
        return this.installerAPIJSON.dictionaryNamed('links').getOrThrow(name);
    };
    Object.defineProperty(InstallerRestSession.prototype, "serverConfigResourceURL", {
        get: function () {
            return this.linkNamed('config');
        },
        enumerable: true,
        configurable: true
    });
    InstallerRestSession.prototype.services = function () {
        var _this = this;
        return this.authedRestClient.get(this.servicesResourceURL)
            .then(function (response) { return _this.installer.newInstallerServices(_this.typedJSON.newJSONObject(response.jsonBody()), _this.authedRestClient); });
    };
    Object.defineProperty(InstallerRestSession.prototype, "servicesResourceURL", {
        get: function () {
            return this.linkNamed('services');
        },
        enumerable: true,
        configurable: true
    });
    InstallerRestSession.prototype.process = function () {
        var _this = this;
        return this.authedRestClient.get(this.processResourceURL)
            .then(function (response) { return _this.installer.newInstallerProcess(_this.typedJSON.newJSONObject(response.jsonBody()), _this.authedRestClient, _this.processResourceURL); });
    };
    Object.defineProperty(InstallerRestSession.prototype, "processResourceURL", {
        get: function () {
            return this.linkNamed('process');
        },
        enumerable: true,
        configurable: true
    });
    return InstallerRestSession;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = InstallerRestSession;
//# sourceMappingURL=installer-rest-session.js.map