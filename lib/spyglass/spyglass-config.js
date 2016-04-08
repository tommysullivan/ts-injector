"use strict";
var SpyglassConfig = (function () {
    function SpyglassConfig(configJSON) {
        this.configJSON = configJSON;
    }
    Object.defineProperty(SpyglassConfig.prototype, "spyglassHealthCheckServiceNames", {
        get: function () {
            return this.configJSON.listNamed('spyglassHealthCheckServiceNames');
        },
        enumerable: true,
        configurable: true
    });
    return SpyglassConfig;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SpyglassConfig;
//# sourceMappingURL=spyglass-config.js.map