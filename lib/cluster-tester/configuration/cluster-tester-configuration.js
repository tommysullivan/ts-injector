"use strict";
var ClusterTesterConfiguration = (function () {
    function ClusterTesterConfiguration() {
    }
    ClusterTesterConfiguration.prototype.testClusters = function () {
        throw new Error('not impl');
    };
    ClusterTesterConfiguration.prototype.clusterConfigurationForId = function (id) {
        throw new Error('not impl');
    };
    ClusterTesterConfiguration.prototype.defaultPhase = function () {
        throw new Error('not impl');
    };
    ClusterTesterConfiguration.prototype.defaultFeatures = function () {
        throw new Error('not impl');
    };
    ClusterTesterConfiguration.prototype.testSuites = function () {
        throw new Error('not impl');
    };
    return ClusterTesterConfiguration;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ClusterTesterConfiguration;
//# sourceMappingURL=cluster-tester-configuration.js.map