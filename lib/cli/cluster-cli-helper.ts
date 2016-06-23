import IProcess from "../node-js-wrappers/i-process";
import ICollections from "../collections/i-collections";
import ClusterTestingConfiguration from "../cluster-testing/cluster-testing-configuration";
import IConsole from "../node-js-wrappers/i-console";
import CliHelper from "./cli-helper";
import ClusterSnapshotCliHelper from "./cluster-snapshot-cli-helper";
import IESXIAction from "../esxi/i-esxi-action";
import Clusters from "../clusters/clusters";
import ClusterTesting from "../cluster-testing/cluster-testing";

export default class ClusterCliHelper {

    constructor(
        private process:IProcess,
        private console:IConsole,
        private collections:ICollections,
        private cliHelper:CliHelper,
        private clusterSnapshotCliHelper:ClusterSnapshotCliHelper,
        private clusters:Clusters,
        private clusterTesting:ClusterTesting
    ) {}

    executeClusterCli():void {
        try {
            var subCommand = this.process.getArgvOrThrow('subCommand', 3);
            if(subCommand=='ids') {
                this.console.log(`clusterIds: ${this.clusters.allIds().join(',')}`);
            }
            else if(subCommand=='hosting') {
                var hostName = this.process.getArgvOrThrow('hostName', 4);
                var matchingClusterIds = this.clusters.allConfigurations.filter(
                    clusterConfig => clusterConfig.nodes.map(n=>n.host).contains(hostName)
                ).map(c=>c.id);
                this.console.log(`clusterIds: ${matchingClusterIds.toJSONString()}`);
            }
            else if(subCommand=='hosts') {
                this.cliHelper.verifyFillerWord('for', 4);
                var clusterId = this.process.getArgvOrThrow('clusterId', 5);
                var hosts = this.clusters.clusterConfigurationWithId(clusterId)
                    .nodes.map(n=>n.host);
                this.console.log(`hosts: ${hosts.toJSONString()}`);
            }
            else if(subCommand=='esxi') {
                this.cliHelper.verifyFillerWord('for', 4);
                var clusterId = this.process.getArgvOrThrow('clusterId', 5);
                var esxiHost = this.clusters.clusterConfigurationWithId(clusterId)
                    .esxiServerConfiguration.host;
                this.console.log(`esxiHost: ${esxiHost}`);
            }
            else if(subCommand=='config') {
                this.cliHelper.verifyFillerWord('for', 4);
                var clusterId = this.process.getArgvOrThrow('clusterId', 5);
                this.console.log(this.clusters.clusterConfigurationWithId(clusterId).toString());
            }
            else if(subCommand=='versions') {
                this.cliHelper.verifyFillerWord('for', 4);
                var clusterId = this.process.getArgvOrThrow('clusterId', 5);
                var cluster = this.clusterTesting.clusterForId(clusterId);
                cluster.versionGraph()
                    .then(versionGraph=>this.console.log(versionGraph.toJSONString()))
                    .catch(e => this.cliHelper.logError(e));
            }
            else if(subCommand=='power') {
                var actionName = this.process.getArgvOrThrow('desiredPowerStatus(on|off|reset)', 4);
                var clusterId = this.process.getArgvOrThrow('clusterId', 5);
                var actions = this.collections.newEmptyDictionary<IESXIAction>()
                    .add('reset', e => e.powerReset())
                    .add('on', e => e.powerOn())
                    .add('off', e => e.powerOff());
                var action = actions.getOrThrow(actionName, `invalid action ${actionName}`);
                this.clusterTesting.esxiManagedClusterForId(clusterId).performESXIAction(action)
                    .then(result=>this.console.log(result.toJSONString()));
            }
            else if(subCommand=='snapshot') {
                this.clusterSnapshotCliHelper.executeClusterSnapshotCli();
            }
            else throw new Error(`invalid subCommand ${subCommand}`);
        }
        catch(e) {
            this.logClusterUsage();
            throw e;
        }
    }

    private logClusterUsage():void {
        this.console.log([
            '',
            'Usage:',
            `${this.process.processName()} cluster [subCommand]`,
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
    }
}