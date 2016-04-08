"use strict";
var service_configuration_1 = require("./service-configuration");
var VersioningConfig = (function () {
    function VersioningConfig(configJSON) {
        this.configJSON = configJSON;
    }
    VersioningConfig.prototype.serviceSet = function () {
        return this.configJSON.listOfJSONObjectsNamed('serviceSet').map(function (serviceJSON) { return new service_configuration_1.default(serviceJSON); });
    };
    return VersioningConfig;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = VersioningConfig;
//# sourceMappingURL=versioning-config.js.map