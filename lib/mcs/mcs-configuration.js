"use strict";
var MCSConfiguration = (function () {
    function MCSConfiguration(configJSON) {
        this.configJSON = configJSON;
    }
    Object.defineProperty(MCSConfiguration.prototype, "mcsLoginPath", {
        get: function () { return this.configJSON.stringPropertyNamed('mcsLoginPath'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MCSConfiguration.prototype, "mcsDashboardInfoPath", {
        get: function () { return this.configJSON.stringPropertyNamed('mcsDashboardInfoPath'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MCSConfiguration.prototype, "mcsApplicationLinkPathTemplate", {
        get: function () { return this.configJSON.stringPropertyNamed('mcsApplicationLinkPathTemplate'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MCSConfiguration.prototype, "username", {
        get: function () { return this.configJSON.stringPropertyNamed('username'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MCSConfiguration.prototype, "password", {
        get: function () { return this.configJSON.stringPropertyNamed('password'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MCSConfiguration.prototype, "mcsUrlTemplate", {
        get: function () { return this.configJSON.stringPropertyNamed('mcsUrlTemplate'); },
        enumerable: true,
        configurable: true
    });
    return MCSConfiguration;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MCSConfiguration;
//# sourceMappingURL=mcs-configuration.js.map