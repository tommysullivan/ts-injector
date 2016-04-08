"use strict";
var node_version_graph_1 = require("./node-version-graph");
var cluster_version_graph_1 = require("./cluster-version-graph");
var service_configuration_1 = require("./service-configuration");
var Versioning = (function () {
    function Versioning(versioningConfig) {
        this.versioningConfig = versioningConfig;
    }
    Versioning.prototype.newNodeVersionGraph = function (host, shellCommandResultSet) {
        return new node_version_graph_1.default(host, shellCommandResultSet);
    };
    Versioning.prototype.newClusterVersionGraph = function (clusterId, nodeVersionGraphs) {
        return new cluster_version_graph_1.default(clusterId, nodeVersionGraphs);
    };
    Versioning.prototype.newServiceConfiguration = function (serviceConfigurationJSON) {
        return new service_configuration_1.default(serviceConfigurationJSON);
    };
    Versioning.prototype.serviceSet = function () {
        return this.versioningConfig.serviceSet();
    };
    return Versioning;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Versioning;
//# sourceMappingURL=versioning.js.map