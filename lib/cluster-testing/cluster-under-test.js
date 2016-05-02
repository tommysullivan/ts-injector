"use strict";
var ClusterUnderTest = (function () {
    function ClusterUnderTest(clusterInstallerConfiguration, promiseFactory, clusterNodes, versioning, clusterConfig, serviceDiscoverer, clusterTesting, clusterInstaller) {
        this.clusterInstallerConfiguration = clusterInstallerConfiguration;
        this.promiseFactory = promiseFactory;
        this.clusterNodes = clusterNodes;
        this.versioning = versioning;
        this.clusterConfig = clusterConfig;
        this.serviceDiscoverer = serviceDiscoverer;
        this.clusterTesting = clusterTesting;
        this.clusterInstaller = clusterInstaller;
    }
    Object.defineProperty(ClusterUnderTest.prototype, "installationTimeoutInMilliseconds", {
        get: function () {
            return this.clusterInstallerConfiguration.installationTimeoutInMilliseconds;
        },
        enumerable: true,
        configurable: true
    });
    ClusterUnderTest.prototype.nodeWithHostName = function (hostName) {
        return this.nodes().firstWhere(function (n) { return n.host == hostName; });
    };
    ClusterUnderTest.prototype.newAuthedMCSSession = function () {
        return this.serviceDiscoverer.nodeHostingServiceViaDiscover(this, 'mapr-webserver')
            .then(function (node) { return node.newAuthedMCSSession(); });
    };
    ClusterUnderTest.prototype.newAuthedInstallerSession = function () {
        return this.serviceDiscoverer.nodeHostingServiceViaDiscover(this, 'mapr-installer')
            .then(function (node) { return node.newAuthedInstallerSession(); });
    };
    ClusterUnderTest.prototype.newOpenTSDBRestClient = function () {
        return this.serviceDiscoverer.nodeHostingServiceViaDiscover(this, 'mapr-opentsdb')
            .then(function (node) { return node.newOpenTSDBRestClient(); });
    };
    ClusterUnderTest.prototype.newElasticSearchClient = function () {
        return this.serviceDiscoverer.nodeHostingServiceViaDiscover(this, 'mapr-elasticsearch')
            .then(function (node) { return node.newElasticSearchClient(); });
    };
    ClusterUnderTest.prototype.isManagedByESXI = function () {
        return this.clusterConfig.esxiServerConfiguration != null;
    };
    Object.defineProperty(ClusterUnderTest.prototype, "name", {
        get: function () {
            return this.clusterConfig.name;
        },
        enumerable: true,
        configurable: true
    });
    ClusterUnderTest.prototype.revertToState = function (stateName) {
        return this.clusterTesting.esxiManagedClusterForId(this.clusterConfig.id).revertToState(stateName);
    };
    ClusterUnderTest.prototype.deleteSnapshotsWithStateName = function (stateName) {
        return this.clusterTesting.esxiManagedClusterForId(this.clusterConfig.id).deleteSnapshotsWithStateName(stateName);
    };
    ClusterUnderTest.prototype.snapshotInfo = function () {
        return this.clusterTesting.esxiManagedClusterForId(this.clusterConfig.id).snapshotInfo();
    };
    ClusterUnderTest.prototype.captureSnapshotNamed = function (stateName) {
        return this.clusterTesting.esxiManagedClusterForId(this.clusterConfig.id).captureSnapshotNamed(stateName);
    };
    //TODO: Depend directly on clusterInstaller and then construct that with instance of this class
    ClusterUnderTest.prototype.verifyMapRNotInstalled = function () {
        return this.clusterInstaller.verifyMapRNotInstalled(this);
    };
    ClusterUnderTest.prototype.executeShellCommandOnEachNode = function (command) {
        return this.promiseFactory.newGroupPromise(this.clusterNodes.map(function (n) { return n.executeShellCommand(command); }));
    };
    ClusterUnderTest.prototype.executeShellCommandsOnEachNode = function (commands) {
        return this.promiseFactory.newGroupPromise(this.clusterNodes.map(function (n) { return n.executeShellCommands(commands); }));
    };
    ClusterUnderTest.prototype.versionGraph = function () {
        var _this = this;
        return this.promiseFactory.newGroupPromise(this.clusterNodes.map(function (n) { return n.versionGraph(); }))
            .then(function (versionGraphs) {
            return _this.versioning.newClusterVersionGraph(_this.clusterConfig.id, versionGraphs);
        });
    };
    ClusterUnderTest.prototype.nodes = function () {
        return this.clusterNodes.clone();
    };
    ClusterUnderTest.prototype.nodesHosting = function (serviceName) {
        return this.clusterNodes.filter(function (n) { return n.isHostingService(serviceName); });
    };
    ClusterUnderTest.prototype.nodeHosting = function (serviceName) {
        return this.nodesHosting(serviceName).first();
    };
    ClusterUnderTest.prototype.executeCopyCommandOnEachNode = function (localPath, remotePath) {
        return this.promiseFactory.newGroupPromise(this.clusterNodes.map(function (n) { return n.executeCopyCommand(localPath, remotePath); }));
    };
    return ClusterUnderTest;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ClusterUnderTest;
//# sourceMappingURL=cluster-under-test.js.map