"use strict";
var InstallerServerConfiguration = (function () {
    function InstallerServerConfiguration(installer, serverConfigJSON, authedRestClient, serverConfigResourceURL) {
        this.installer = installer;
        this.serverConfigJSON = serverConfigJSON;
        this.authedRestClient = authedRestClient;
        this.serverConfigResourceURL = serverConfigResourceURL;
    }
    InstallerServerConfiguration.prototype.setServiceEnablement = function (serviceName, version, enabled) {
        this.serverConfigJSON.dictionaryNamed('services').add(serviceName, {
            version: version,
            enabled: enabled
        });
        return this;
    };
    InstallerServerConfiguration.prototype.enableService = function (serviceName, version) {
        return this.setServiceEnablement(serviceName, version, true);
    };
    InstallerServerConfiguration.prototype.disableService = function (serviceName, version) {
        return this.setServiceEnablement(serviceName, version, false);
    };
    InstallerServerConfiguration.prototype.setSSHPassword = function (newValue) { this.serverConfigJSON.setProperty('ssh_password', newValue); return this; };
    InstallerServerConfiguration.prototype.setClusterAdminPassword = function (newValue) { this.serverConfigJSON.setProperty('cluster_admin_password', newValue); return this; };
    InstallerServerConfiguration.prototype.setSSHUsername = function (newValue) { this.serverConfigJSON.setProperty('ssh_id', newValue); return this; };
    InstallerServerConfiguration.prototype.setSSHMethod = function (newValue) { this.serverConfigJSON.setProperty('ssh_method', newValue); return this; };
    InstallerServerConfiguration.prototype.setLicenseType = function (newValue) { this.serverConfigJSON.setProperty('license_type', newValue); return this; };
    InstallerServerConfiguration.prototype.setDisks = function (newValue) { this.serverConfigJSON.setProperty('disks', newValue.toArray()); return this; };
    InstallerServerConfiguration.prototype.setHosts = function (newValue) { this.serverConfigJSON.setProperty('hosts', newValue.toArray()); return this; };
    InstallerServerConfiguration.prototype.setClusterName = function (newValue) { this.serverConfigJSON.setProperty('cluster_name', newValue); return this; };
    InstallerServerConfiguration.prototype.save = function () {
        var _this = this;
        var putArgs = {
            body: this.serverConfigJSON.toRawJSON(),
            json: true
        };
        return this.authedRestClient.put(this.serverConfigResourceURL, putArgs)
            .then(function (ignoredPutResult) { return _this.authedRestClient.get(_this.serverConfigResourceURL); })
            .then(function (getResult) {
            _this.serverConfigJSON = getResult.jsonBody();
            return _this.installer.newInstallerServerConfiguration(_this.serverConfigJSON, _this.authedRestClient, _this.serverConfigResourceURL);
        });
    };
    InstallerServerConfiguration.prototype.toString = function () {
        return this.toJSONString();
    };
    InstallerServerConfiguration.prototype.toJSONString = function () {
        return JSON.stringify(this.serverConfigJSON, null, 3);
    };
    return InstallerServerConfiguration;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = InstallerServerConfiguration;
//# sourceMappingURL=installer-server-configuration.js.map