"use strict";
var cluster_installer_config_1 = require("./cluster-installer-config");
var ClusterTestingConfiguration = (function () {
    function ClusterTestingConfiguration(configJSON, basePathToUseForConfiguredRelativePaths, path, process) {
        this.configJSON = configJSON;
        this.basePathToUseForConfiguredRelativePaths = basePathToUseForConfiguredRelativePaths;
        this.path = path;
        this.process = process;
    }
    ClusterTestingConfiguration.prototype.envVarOrConfiguredVal = function (propName) {
        var _this = this;
        return this.process.environmentVariableNamedOrLazyDefault(propName, function () { return _this.configJSON.stringPropertyNamed(propName); });
    };
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
    Object.defineProperty(ClusterTestingConfiguration.prototype, "releaseUnderTest", {
        get: function () {
            return this.process.environmentVariableNamedOrDefault('release', this.configJSON.stringPropertyNamed('defaultRelease'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClusterTestingConfiguration.prototype, "lifecyclePhase", {
        get: function () {
            return this.process.environmentVariableNamedOrDefault('lifecyclePhase', this.configJSON.stringPropertyNamed('defaultLifecyclePhase'));
        },
        enumerable: true,
        configurable: true
    });
    return ClusterTestingConfiguration;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ClusterTestingConfiguration;
//# sourceMappingURL=cluster-testing-configuration.js.map