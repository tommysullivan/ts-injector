"use strict";
var cluster_under_test_1 = require("./cluster-under-test");
var node_under_test_1 = require("./node-under-test");
var esxi_managed_cluster_1 = require("./esxi-managed-cluster");
var cluster_installer_1 = require("./cluster-installer");
var cluster_test_result_1 = require("./cluster-test-result");
var multi_cluster_tester_1 = require("./multi-cluster-tester");
var result_reporter_1 = require("./result-reporter");
var cluster_log_capturer_1 = require("./cluster-log-capturer");
var ClusterTesting = (function () {
    function ClusterTesting(clusterTestingConfiguration, promiseFactory, sshClient, collections, versioning, mcs, openTSDB, installer, elasticSearch, serviceDiscoverer, esxi, clusters, packaging, releasing, uuidGenerator, process, cucumber, console, frameworkConfig, fileSystem, rest, path) {
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
        this.uuidGenerator = uuidGenerator;
        this.process = process;
        this.cucumber = cucumber;
        this.console = console;
        this.frameworkConfig = frameworkConfig;
        this.fileSystem = fileSystem;
        this.rest = rest;
        this.path = path;
    }
    ClusterTesting.prototype.clusterForId = function (clusterId) {
        return this.newClusterUnderTest(this.clusters.clusterConfigurationWithId(clusterId));
    };
    ClusterTesting.prototype.esxiManagedClusterForId = function (clusterId) {
        return this.newESXIManagedCluster(this.clusters.clusterConfigurationWithId(clusterId));
    };
    ClusterTesting.prototype.newMultiClusterTester = function () {
        return new multi_cluster_tester_1.default(this.uuidGenerator, this.path, this.clusterTestingConfiguration, this.clusters, this.process, this.cucumber, this.console, this.promiseFactory, this, this.newResultReporter(), this.newClusterLogCapturer(), this.collections);
    };
    ClusterTesting.prototype.newClusterLogCapturer = function () {
        return new cluster_log_capturer_1.default(this.clusterTestingConfiguration.mcsLogFileLocation, this.clusterTestingConfiguration.wardenLogLocation, this.clusterTestingConfiguration.configureShLogLocation, this.clusterTestingConfiguration.mfsInitLogFileLocation, this.promiseFactory);
    };
    ClusterTesting.prototype.newResultReporter = function () {
        return new result_reporter_1.default(this.frameworkConfig, this.fileSystem, this.rest, this, this.console, this.clusterTestingConfiguration, this.process, this.promiseFactory, this.path);
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
    ClusterTesting.prototype.newClusterTestResult = function (cucumberTestResult, frameworkConfiguration, versionGraph, versionGraphError, clusterConfiguration, logs) {
        return new cluster_test_result_1.default(cucumberTestResult, frameworkConfiguration, versionGraph, versionGraphError, clusterConfiguration, logs);
    };
    return ClusterTesting;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ClusterTesting;
//# sourceMappingURL=cluster-testing.js.map