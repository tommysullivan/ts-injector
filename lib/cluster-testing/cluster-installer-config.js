"use strict";
var ClusterInstallerConfig = (function () {
    function ClusterInstallerConfig(configJSON) {
        this.configJSON = configJSON;
    }
    Object.defineProperty(ClusterInstallerConfig.prototype, "installationTimeoutInMilliseconds", {
        get: function () {
            return this.configJSON.numericPropertyNamed('installationTimeoutInMilliseconds');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClusterInstallerConfig.prototype, "licenseType", {
        get: function () {
            return this.configJSON.stringPropertyNamed('licenseType');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClusterInstallerConfig.prototype, "sshMethod", {
        get: function () {
            return this.configJSON.stringPropertyNamed('sshMethod');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClusterInstallerConfig.prototype, "sshUsername", {
        get: function () {
            return this.configJSON.stringPropertyNamed('sshUsername');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClusterInstallerConfig.prototype, "sshPassword", {
        get: function () {
            return this.configJSON.stringPropertyNamed('sshPassword');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClusterInstallerConfig.prototype, "adminUsername", {
        get: function () {
            return this.configJSON.stringPropertyNamed('adminUsername');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClusterInstallerConfig.prototype, "adminPassword", {
        get: function () {
            return this.configJSON.stringPropertyNamed('adminPassword');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClusterInstallerConfig.prototype, "coreVersion", {
        get: function () {
            return this.configJSON.stringPropertyNamed('coreVersion');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClusterInstallerConfig.prototype, "location", {
        get: function () {
            return this.configJSON.stringPropertyNamed('location');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClusterInstallerConfig.prototype, "disks", {
        get: function () {
            return this.configJSON.listNamed('disks');
        },
        enumerable: true,
        configurable: true
    });
    return ClusterInstallerConfig;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ClusterInstallerConfig;
//# sourceMappingURL=cluster-installer-config.js.map