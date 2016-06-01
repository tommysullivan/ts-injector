"use strict";
var esxi_node_configuration_1 = require("../esxi/configuration/esxi-node-configuration");
var NodeConfiguration = (function () {
    function NodeConfiguration(nodeJSON, operatingSystems) {
        this.nodeJSON = nodeJSON;
        this.operatingSystems = operatingSystems;
    }
    NodeConfiguration.prototype.snapshotIdFromStateName = function (stateName) {
        return this.esxiNodeConfiguration.states
            .firstWhere(function (s) { return s.name == stateName; }).snapshotId;
    };
    Object.defineProperty(NodeConfiguration.prototype, "host", {
        get: function () { return this.nodeJSON.stringPropertyNamed('host'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NodeConfiguration.prototype, "username", {
        get: function () { return this.nodeJSON.stringPropertyNamed('username'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NodeConfiguration.prototype, "password", {
        get: function () { return this.nodeJSON.stringPropertyNamed('password'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NodeConfiguration.prototype, "name", {
        get: function () { return this.nodeJSON.stringPropertyNamed('name'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NodeConfiguration.prototype, "esxiNodeConfiguration", {
        get: function () {
            return new esxi_node_configuration_1.default(this.nodeJSON.jsonObjectNamed('esxi'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NodeConfiguration.prototype, "operatingSystem", {
        get: function () {
            return this.operatingSystems.newOperatingSystemFromConfig(this.nodeJSON.jsonObjectNamed('operatingSystem'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NodeConfiguration.prototype, "serviceNames", {
        get: function () {
            return this.nodeJSON.listNamed('serviceNames');
        },
        enumerable: true,
        configurable: true
    });
    NodeConfiguration.prototype.toJSON = function () { return this.nodeJSON.toRawJSON(); };
    return NodeConfiguration;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NodeConfiguration;
//# sourceMappingURL=node-configuration.js.map