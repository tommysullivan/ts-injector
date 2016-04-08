"use strict";
var cluster_installer_config_1 = require("./cluster-installer-config");
var ClusterTestingConfiguration = (function () {
    function ClusterTestingConfiguration(configJSON, basePathToUseForConfiguredRelativePaths, path) {
        this.configJSON = configJSON;
        this.basePathToUseForConfiguredRelativePaths = basePathToUseForConfiguredRelativePaths;
        this.path = path;
    }
    ClusterTestingConfiguration.prototype.portalUrlWithId = function (id) {
        return this.configJSON.jsonObjectNamed('resultServers').stringPropertyNamed(id);
    };
    Object.defineProperty(ClusterTestingConfiguration.prototype, "frameworkOutputPath", {
        get: function () {
            return this.path.join(this.basePathToUseForConfiguredRelativePaths, this.configJSON.stringPropertyNamed('frameworkOutputPathRelativeToThisConfigFile'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClusterTestingConfiguration.prototype, "cucumberOutputPath", {
        get: function () {
            return this.path.join(this.basePathToUseForConfiguredRelativePaths, this.configJSON.stringPropertyNamed('cucumberOutputPathRelativeToThisConfigFile'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClusterTestingConfiguration.prototype, "clusterInstallerConfiguration", {
        get: function () {
            return new cluster_installer_config_1.default(this.configJSON.jsonObjectNamed('clusterInstaller'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClusterTestingConfiguration.prototype, "defaultPhase", {
        get: function () { return this.configJSON.stringPropertyNamed('defaultPhase'); },
        enumerable: true,
        configurable: true
    });
    return ClusterTestingConfiguration;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ClusterTestingConfiguration;
//# sourceMappingURL=cluster-testing-configuration.js.map