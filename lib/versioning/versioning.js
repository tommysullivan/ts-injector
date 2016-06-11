"use strict";
var node_version_graph_1 = require("./node-version-graph");
var cluster_version_graph_1 = require("./cluster-version-graph");
var Versioning = (function () {
    function Versioning() {
    }
    Versioning.prototype.newNodeVersionGraph = function (host, shellCommandResultSet) {
        return new node_version_graph_1.default(host, shellCommandResultSet);
    };
    Versioning.prototype.newClusterVersionGraph = function (clusterId, nodeVersionGraphs) {
        return new cluster_version_graph_1.default(clusterId, nodeVersionGraphs);
    };
    return Versioning;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Versioning;
//# sourceMappingURL=versioning.js.map