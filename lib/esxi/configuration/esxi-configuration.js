"use strict";
var esxi_server_configuration_1 = require("./esxi-server-configuration");
var ESXIConfiguration = (function () {
    function ESXIConfiguration(configJSON) {
        this.configJSON = configJSON;
    }
    Object.defineProperty(ESXIConfiguration.prototype, "servers", {
        get: function () {
            return this.configJSON.listOfJSONObjectsNamed('servers').map(function (c) { return new esxi_server_configuration_1.default(c); });
        },
        enumerable: true,
        configurable: true
    });
    return ESXIConfiguration;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ESXIConfiguration;
//# sourceMappingURL=esxi-configuration.js.map