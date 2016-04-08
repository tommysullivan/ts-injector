"use strict";
var InstallerClientConfiguration = (function () {
    function InstallerClientConfiguration(configJSON) {
        this.configJSON = configJSON;
    }
    Object.defineProperty(InstallerClientConfiguration.prototype, "installerAPIPath", {
        get: function () {
            return this.configJSON.stringPropertyNamed('installerAPIPath');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallerClientConfiguration.prototype, "installerLoginPath", {
        get: function () {
            return this.configJSON.stringPropertyNamed('installerLoginPath');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallerClientConfiguration.prototype, "installerPollingFrequencyMS", {
        get: function () {
            return this.configJSON.numericPropertyNamed('installerPollingFrequencyMS');
        },
        enumerable: true,
        configurable: true
    });
    return InstallerClientConfiguration;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = InstallerClientConfiguration;
//# sourceMappingURL=installer-client-configuration.js.map