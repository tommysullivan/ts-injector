"use strict";
var cluster_configuration_1 = require("../../clusters/cluster-configuration");
var test_suite_configuration_1 = require("./test-suite-configuration");
var ClusterTesterConfiguration = (function () {
    function ClusterTesterConfiguration(configurationJSON) {
        this.configJSON = configurationJSON;
    }
    Object.defineProperty(ClusterTesterConfiguration.prototype, "testClusters", {
        get: function () {
            return this.configJSON.listOfJSONObjectsNamed('testClusters').map(function (testClusterJSON) { return new cluster_configuration_1.default(testClusterJSON); });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClusterTesterConfiguration.prototype, "testSuites", {
        get: function () {
            return this.configJSON.listOfJSONObjectsNamed('testSuites').map(function (testSuiteJSON) { return new test_suite_configuration_1.default(testSuiteJSON); });
        },
        enumerable: true,
        configurable: true
    });
    ClusterTesterConfiguration.prototype.clusterConfigurationForId = function (id) {
        return this.testClusters.firstWhere(function (c) { return c.id == id; }, "cluster id not found " + id);
    };
    Object.defineProperty(ClusterTesterConfiguration.prototype, "defaultPhase", {
        get: function () { return this.configJSON.stringPropertyNamed('defaultPhase'); },
        enumerable: true,
        configurable: true
    });
    return ClusterTesterConfiguration;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ClusterTesterConfiguration;
//# sourceMappingURL=cluster-tester-configuration.js.map