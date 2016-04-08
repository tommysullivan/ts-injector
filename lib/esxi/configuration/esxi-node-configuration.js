"use strict";
var snapshot_configuration_1 = require("./snapshot-configuration");
var ESXINodeConfiguration = (function () {
    function ESXINodeConfiguration(configJSON) {
        this.configJSON = configJSON;
    }
    Object.defineProperty(ESXINodeConfiguration.prototype, "name", {
        get: function () { return this.configJSON.stringPropertyNamed('name'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ESXINodeConfiguration.prototype, "id", {
        get: function () { return this.configJSON.numericPropertyNamed('id'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ESXINodeConfiguration.prototype, "states", {
        get: function () {
            return this.configJSON.listOfJSONObjectsNamed('states').map(function (stateJSON) { return new snapshot_configuration_1.default(stateJSON); });
        },
        enumerable: true,
        configurable: true
    });
    return ESXINodeConfiguration;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ESXINodeConfiguration;
//# sourceMappingURL=esxi-node-configuration.js.map