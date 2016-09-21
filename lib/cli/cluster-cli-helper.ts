import {ICollections} from "../collections/i-collections";
import {IConsole} from "../node-js-wrappers/i-console";
import {CliHelper} from "./cli-helper";
import {IESXIAction} from "../esxi/i-esxi-action";
import {IClusters} from "../clusters/i-clusters";
import {IClusterTesting} from "../cluster-testing/i-cluster-testing";
import {IClusterConfiguration} from "../clusters/i-cluster-configuration";

export class ClusterCliHelper {

    constructor(
        private console:IConsole,
        private collections:ICollections,
        private cliHelper:CliHelper,
        private clusters:IClusters,
        private clusterTesting:IClusterTesting
    ) {}

    showClusterIds():void {
        this.console.log(`clusterIds: ${this.clusters.allIds.sort()}`);
    }

    private clusterContainsHost(clusterConfig:IClusterConfiguration, hostName:string):boolean {
        return this.collections.newList(clusterConfig.nodes).map(n=>n.host).contains(hostName);
    }

    showNodesHostingService(hostName:string):void {
        const matchingClusterIds = this.clusters.allConfigurations.filter(
            clusterConfig => this.clusterContainsHost(clusterConfig, hostName)
        ).map(c=>c.id);
        this.console.log(`clusterIds: ${matchingClusterIds.join(',')}`);
    }

    showConfigForCluster(clusterId:string):void {
        this.console.log(this.clusters.clusterConfigurationWithId(clusterId).toString());
    }

    powerForCluster(actionName:string, clusterId:string):void {
        const actions = this.collections.newEmptyDictionary<IESXIAction>()
            .add('reset', e => e.powerReset())
            .add('on', e => e.powerOn())
            .add('off', e => e.powerOff());
        const action = actions.getOrThrow(actionName, `invalid action ${actionName}`);
        this.clusterTesting.esxiManagedClusterForId(clusterId).performESXIAction(action)
            .then(result=>this.console.log(result.toString()));
    }

    showVersionsForCluster(clusterId:string):void {
        const cluster = this.clusterTesting.clusterForId(clusterId);
        cluster.versionGraph()
            .then(versionGraph=>this.console.log(versionGraph.toString()))
            .catch(e => this.cliHelper.logError(e));
    }

    showHostsForCluster(clusterId:string):void {
        const hosts = this.collections.newList(
            this.clusters.clusterConfigurationWithId(clusterId)
                .nodes.map(n=>n.host)
        );
        this.console.log(`hosts:`, hosts.sort().toString());
    }

    showESXIForCluster(clusterId:string):void {
        const esxiHost = this.clusterTesting.clusterForId(clusterId)
            .esxiServerConfiguration.host;
        this.console.log(`esxiHost: ${esxiHost}`);
    }

}