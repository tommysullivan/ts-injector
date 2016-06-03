"use strict";
var cluster_under_test_1 = require("./cluster-under-test");
var node_under_test_1 = require("./node-under-test");
var esxi_managed_cluster_1 = require("./esxi-managed-cluster");
var cluster_installer_1 = require("./cluster-installer");
var cluster_test_result_1 = require("./cluster-test-result");
var ClusterTesting = (function () {
    function ClusterTesting(clusterTestingConfiguration, promiseFactory, sshClient, collections, versioning, mcs, openTSDB, installer, elasticSearch, serviceDiscoverer, esxi, clusters, packaging, releasing) {
        this.clusterTestingConfiguration = clusterTestingConfiguration;
        this.promiseFactory = promiseFactory;
        this.sshClient = sshClient;
        this.collections = collections;
        this.versioning = versioning;
        this.mcs = mcs;
        this.openTSDB = openTSDB;
        this.installer = installer;
        this.elasticSearch = elasticSearch;
        this.serviceDiscoverer = serviceDiscoverer;
        this.esxi = esxi;
        this.clusters = clusters;
        this.packaging = packaging;
        this.releasing = releasing;
    }
    ClusterTesting.prototype.esxiManagedClusterForId = function (clusterId) {
        return this.newESXIManagedCluster(this.clusters.clusterConfigurationWithId(clusterId));
    };
    ClusterTesting.prototype.newClusterUnderTest = function (clusterConfiguration) {
        var _this = this;
        return new cluster_under_test_1.default(this.clusterTestingConfiguration.clusterInstallerConfiguration, this.promiseFactory, clusterConfiguration.nodes.map(function (n) { return _this.newNodeUnderTest(n); }), this.versioning, clusterConfiguration, this.serviceDiscoverer, this, this.newClusterInstaller(), this.packaging);
    };
    ClusterTesting.prototype.newClusterInstaller = function () {
        return new cluster_installer_1.default(this.promiseFactory, this.clusterTestingConfiguration.clusterInstallerConfiguration);
    };
    ClusterTesting.prototype.newNodeUnderTest = function (nodeConfiguration) {
        return new node_under_test_1.default(nodeConfiguration, this.sshClient, this.promiseFactory, this.collections, this.mcs, this.openTSDB, this.installer, this.elasticSearch, this.versioning, this.packaging, this.defaultReleasePhase);
    };
    Object.defineProperty(ClusterTesting.prototype, "defaultReleasePhase", {
        get: function () {
            return this.releasing.defaultReleases
                .releaseNamed(this.clusterTestingConfiguration.releaseUnderTest)
                .phaseNamed(this.clusterTestingConfiguration.lifecyclePhase);
        },
        enumerable: true,
        configurable: true
    });
    ClusterTesting.prototype.newESXIManagedCluster = function (clusterConfiguration) {
        return new esxi_managed_cluster_1.default(clusterConfiguration, this.esxi, this.promiseFactory);
    };
    ClusterTesting.prototype.newClusterTestResult = function (cucumberRunConfig, cucumberTestResult, frameworkConfiguration, versionGraph, versionGraphError, clusterConfiguration) {
        return new cluster_test_result_1.default(cucumberRunConfig, cucumberTestResult, frameworkConfiguration, versionGraph, versionGraphError, clusterConfiguration);
    };
    return ClusterTesting;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ClusterTesting;
//# sourceMappingURL=cluster-testing.js.map