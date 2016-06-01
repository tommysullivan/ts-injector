"use strict";
var node_configuration_1 = require("./../nodes/node-configuration");
var ClusterConfiguration = (function () {
    function ClusterConfiguration(configJSON, esxi, operatingSystems) {
        this.configJSON = configJSON;
        this.esxi = esxi;
        this.operatingSystems = operatingSystems;
    }
    ClusterConfiguration.prototype.toJSON = function () {
        return this.configJSON.toRawJSON();
    };
    Object.defineProperty(ClusterConfiguration.prototype, "id", {
        get: function () { return this.configJSON.stringPropertyNamed('id'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClusterConfiguration.prototype, "name", {
        get: function () { return this.configJSON.stringPropertyNamed('name'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClusterConfiguration.prototype, "adminPassword", {
        get: function () { return this.configJSON.stringPropertyNamed('adminPassword'); },
        enumerable: true,
        configurable: true
    });
    ClusterConfiguration.prototype.toString = function () { return this.configJSON.toString(); };
    Object.defineProperty(ClusterConfiguration.prototype, "esxiServerConfiguration", {
        get: function () {
            return this.esxi.esxiServerConfigurationForId(this.configJSON.stringPropertyNamed('esxiServerId'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClusterConfiguration.prototype, "nodes", {
        get: function () {
            var _this = this;
            return this.configJSON.listOfJSONObjectsNamed('nodes').map(function (nodeJSON) { return new node_configuration_1.default(nodeJSON, _this.operatingSystems); });
        },
        enumerable: true,
        configurable: true
    });
    return ClusterConfiguration;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ClusterConfiguration;
//# sourceMappingURL=cluster-configuration.js.map