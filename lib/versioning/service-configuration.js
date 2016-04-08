"use strict";
var ServiceConfiguration = (function () {
    function ServiceConfiguration(serviceConfigJSON) {
        this.serviceConfigJSON = serviceConfigJSON;
    }
    Object.defineProperty(ServiceConfiguration.prototype, "name", {
        get: function () { return this.serviceConfigJSON.stringPropertyNamed('name'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ServiceConfiguration.prototype, "version", {
        get: function () { return this.serviceConfigJSON.stringPropertyNamed('version'); },
        enumerable: true,
        configurable: true
    });
    ServiceConfiguration.prototype.toJSON = function () { return this.serviceConfigJSON.toRawJSON(); };
    return ServiceConfiguration;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ServiceConfiguration;
//# sourceMappingURL=service-configuration.js.map