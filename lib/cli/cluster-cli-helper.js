"use strict";
var ClusterCliHelper = (function () {
    function ClusterCliHelper(process, console, collections, cliHelper, clusterSnapshotCliHelper, clusters, clusterTesting) {
        this.process = process;
        this.console = console;
        this.collections = collections;
        this.cliHelper = cliHelper;
        this.clusterSnapshotCliHelper = clusterSnapshotCliHelper;
        this.clusters = clusters;
        this.clusterTesting = clusterTesting;
    }
    ClusterCliHelper.prototype.executeClusterCli = function () {
        var _this = this;
        try {
            var subCommand = this.process.getArgvOrThrow('subCommand', 3);
            if (subCommand == 'ids') {
                this.console.log("clusterIds: " + this.clusters.allIds().join(','));
            }
            else if (subCommand == 'hosting') {
                var hostName = this.process.getArgvOrThrow('hostName', 4);
                var matchingClusterIds = this.clusters.allConfigurations.filter(function (clusterConfig) { return clusterConfig.nodes.map(function (n) { return n.host; }).contains(hostName); }).map(function (c) { return c.id; });
                this.console.log("clusterIds: " + matchingClusterIds.toJSONString());
            }
            else if (subCommand == 'hosts') {
                this.cliHelper.verifyFillerWord('for', 4);
                var clusterId = this.process.getArgvOrThrow('clusterId', 5);
                var hosts = this.clusters.clusterConfigurationWithId(clusterId)
                    .nodes.map(function (n) { return n.host; });
                this.console.log("hosts: " + hosts.toJSONString());
            }
            else if (subCommand == 'esxi') {
                this.cliHelper.verifyFillerWord('for', 4);
                var clusterId = this.process.getArgvOrThrow('clusterId', 5);
                var esxiHost = this.clusters.clusterConfigurationWithId(clusterId)
                    .esxiServerConfiguration.host;
                this.console.log("esxiHost: " + esxiHost);
            }
            else if (subCommand == 'config') {
                this.cliHelper.verifyFillerWord('for', 4);
                var clusterId = this.process.getArgvOrThrow('clusterId', 5);
                this.console.log(this.clusters.clusterConfigurationWithId(clusterId).toString());
            }
            else if (subCommand == 'versions') {
                this.cliHelper.verifyFillerWord('for', 4);
                var clusterId = this.process.getArgvOrThrow('clusterId', 5);
                var cluster = this.clusterTesting.clusterForId(clusterId);
                cluster.versionGraph()
                    .then(function (versionGraph) { return _this.console.log(versionGraph.toJSONString()); })
                    .catch(function (e) { return _this.cliHelper.logError(e); });
            }
            else if (subCommand == 'power') {
                var actionName = this.process.getArgvOrThrow('desiredPowerStatus(on|off|reset)', 4);
                var clusterId = this.process.getArgvOrThrow('clusterId', 5);
                var actions = this.collections.newEmptyDictionary()
                    .add('reset', function (e) { return e.powerReset(); })
                    .add('on', function (e) { return e.powerOn(); })
                    .add('off', function (e) { return e.powerOff(); });
                var action = actions.getOrThrow(actionName, "invalid action " + actionName);
                this.clusterTesting.esxiManagedClusterForId(clusterId).performESXIAction(action)
                    .then(function (result) { return _this.console.log(result.toJSONString()); });
            }
            else if (subCommand == 'snapshot') {
                this.clusterSnapshotCliHelper.executeClusterSnapshotCli();
            }
            else
                throw new Error("invalid subCommand " + subCommand);
        }
        catch (e) {
            this.logClusterUsage();
            throw e;
        }
    };
    ClusterCliHelper.prototype.logClusterUsage = function () {
        this.console.log([
            '',
            'Usage:',
            (this.process.processName() + " cluster [subCommand]"),
            '',
            'subCommands                            description',
            '-----------                            -----------',
            'ids                                    list available cluster ids',
            'hosting [hostName]                     yields cluster ids containing specified host',
            'config for [clusterId]                 yields configuration for specified cluster',
            'versions for [clusterId]               yields package / os version info for specified cluster',
            'snapshot [action]                      manage snapshot / state of cluster',
            'power [on|off|reset] [clusterId]       reset cluster power or turn it off or on'
        ].join('\n'));
    };
    return ClusterCliHelper;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ClusterCliHelper;
//# sourceMappingURL=cluster-cli-helper.js.map