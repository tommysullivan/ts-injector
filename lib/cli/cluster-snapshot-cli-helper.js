"use strict";
var ClusterSnapshotCliHelper = (function () {
    function ClusterSnapshotCliHelper(process, console, cliHelper, clusters, clusterTesting) {
        this.process = process;
        this.console = console;
        this.cliHelper = cliHelper;
        this.clusters = clusters;
        this.clusterTesting = clusterTesting;
    }
    ClusterSnapshotCliHelper.prototype.executeClusterSnapshotCli = function () {
        var _this = this;
        try {
            var actionName = this.process.getArgvOrThrow('action', 4);
            if (actionName == 'states') {
                this.cliHelper.verifyFillerWord('for', 5);
                var clusterId = this.process.getArgvOrThrow('clusterId', 6);
                this.console.log(this.clusters.clusterConfigurationWithId(clusterId)
                    .nodes
                    .flatMap(function (n) { return n.esxiNodeConfiguration.states; })
                    .map(function (s) { return s.name; })
                    .unique()
                    .toJSONString());
            }
            else if (actionName == 'info') {
                this.cliHelper.verifyFillerWord('for', 5);
                var clusterId = this.process.getArgvOrThrow('clusterId', 6);
                this.clusterTesting.esxiManagedClusterForId(clusterId).snapshotInfo()
                    .then(function (r) { return _this.logESXIResponse(r); })
                    .catch(function (e) { return _this.cliHelper.logError(e); });
            }
            else if (actionName == 'capture') {
                var snapshotName = this.process.getArgvOrThrow('snapshotName', 5);
                this.cliHelper.verifyFillerWord('from', 6);
                var clusterId = this.process.getArgvOrThrow('clusterId', 7);
                this.clusterTesting.esxiManagedClusterForId(clusterId).captureSnapshotNamed(snapshotName)
                    .then(function (r) { return _this.logESXIResponse(r); })
                    .catch(function (e) { return _this.cliHelper.logError(e); });
            }
            else if (actionName == 'apply') {
                var stateName = this.process.getArgvOrThrow('stateName', 5);
                this.cliHelper.verifyFillerWord('onto', 6);
                var clusterId = this.process.getArgvOrThrow('clusterId', 7);
                this.clusterTesting.esxiManagedClusterForId(clusterId).revertToState(stateName)
                    .then(function (r) { return _this.logESXIResponse(r); })
                    .catch(function (e) { return _this.cliHelper.logError(e); });
            }
            else if (actionName == 'delete') {
                var stateName = this.process.getArgvOrThrow('stateName', 5);
                this.cliHelper.verifyFillerWord('from', 6);
                var clusterId = this.process.getArgvOrThrow('clusterId', 7);
                this.clusterTesting.esxiManagedClusterForId(clusterId).deleteSnapshotsWithStateName(stateName)
                    .then(function (r) { return _this.logESXIResponse(r); })
                    .catch(function (e) { return _this.cliHelper.logError(e); });
            }
            else
                throw new Error("invalid action " + actionName);
        }
        catch (e) {
            this.logSnapshotUsage();
            throw e;
        }
    };
    ClusterSnapshotCliHelper.prototype.logSnapshotUsage = function () {
        this.console.log([
            '',
            'Usage:',
            (this.process.processName() + " cluster snapshot [action]"),
            '',
            'actions                                      description',
            '-------                                      -----------',
            'info for [clusterId]                         list snapshot info for the cluster',
            'capture [snapshotName] from [clusterId]      captures snapshot for cluster, then runs "info" command',
            'apply [stateName] onto [clusterId]           applies snapshots defined by "stateName" to cluster',
            'delete [stateName] from [clusterId]          deletes snapshots defined by "stateName" from cluster',
            '',
            'NOTE: snapshotName is different from stateName!'
        ].join('\n'));
    };
    ClusterSnapshotCliHelper.prototype.logESXIResponse = function (esxiResult) {
        this.console.log(esxiResult.toJSONString());
    };
    return ClusterSnapshotCliHelper;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ClusterSnapshotCliHelper;
//# sourceMappingURL=cluster-snapshot-cli-helper.js.map