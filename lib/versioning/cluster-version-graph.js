"use strict";
var ClusterVersionGraph = (function () {
    function ClusterVersionGraph(clusterId, versionGraphs) {
        this.clusterId = clusterId;
        this.versionGraphs = versionGraphs;
    }
    ClusterVersionGraph.prototype.toJSONString = function () {
        return JSON.stringify(this.toJSON(), null, 3);
    };
    ClusterVersionGraph.prototype.toJSON = function () {
        return {
            clusterId: this.clusterId,
            nodeLevelGraphs: this.versionGraphs.map(function (v) { return v.toJSON(); })
        };
    };
    return ClusterVersionGraph;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ClusterVersionGraph;
//# sourceMappingURL=cluster-version-graph.js.map