"use strict";
var ESXIManagedCluster = (function () {
    function ESXIManagedCluster(clusterConfiguration, esxi, promiseFactory) {
        this.clusterConfiguration = clusterConfiguration;
        this.esxi = esxi;
        this.promiseFactory = promiseFactory;
    }
    ESXIManagedCluster.prototype.performESXIAction = function (esxiAction) {
        var _this = this;
        var esxiServerConfig = this.clusterConfiguration.esxiServerConfiguration;
        var esxiActionPromises = this.clusterConfiguration.nodes.map(function (n) {
            var esxiClient = _this.esxi.newESXIClient(esxiServerConfig.host, esxiServerConfig.username, esxiServerConfig.password, n.esxiNodeConfiguration.id);
            return esxiAction(esxiClient, n);
        });
        return this.promiseFactory.newGroupPromise(esxiActionPromises);
    };
    ESXIManagedCluster.prototype.snapshotInfo = function () {
        return this.performESXIAction(function (e, n) { return e.snapshotInfo(); });
    };
    ESXIManagedCluster.prototype.revertToState = function (stateName) {
        var _this = this;
        return this.performESXIAction(function (e, n) { return e.restoreSnapshot(n.snapshotIdFromStateName(stateName)); })
            .then(function () { return _this.performESXIAction(function (e, n) { return e.powerOn(); }); });
    };
    ESXIManagedCluster.prototype.deleteSnapshotsWithStateName = function (stateName) {
        return this.performESXIAction(function (e, n) { return e.removeSnapshot(n.snapshotIdFromStateName(stateName)); });
    };
    ESXIManagedCluster.prototype.captureSnapshotNamed = function (stateName) {
        return this.performESXIAction(function (e, n) { return e.captureStateAsSnapshot(stateName); });
    };
    ESXIManagedCluster.prototype.powerReset = function () {
        return this.performESXIAction(function (e, n) { return e.powerReset(); });
    };
    return ESXIManagedCluster;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ESXIManagedCluster;
//# sourceMappingURL=esxi-managed-cluster.js.map