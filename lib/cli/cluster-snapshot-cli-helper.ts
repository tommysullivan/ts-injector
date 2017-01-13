import {IConsole} from "../console/i-console";
import {CliHelper} from "./cli-helper";
import {IESXIResponse} from "../esxi/i-esxi-response";
import {IClusters} from "../clusters/i-clusters";
import {IClusterTesting} from "../cluster-testing/i-cluster-testing";
import {ICollections} from "../collections/i-collections";

export class ClusterSnapshotCliHelper {
    constructor(
        private console:IConsole,
        private cliHelper:CliHelper,
        private clusters:IClusters,
        private clusterTesting:IClusterTesting,
        private collections:ICollections
    ) {}

    clusterSnapshotStatesCli(clusterId:string):void {
        const nodeList = this.collections.newList(
            this.clusters.clusterConfigurationWithId(clusterId).nodes
        );
        this.console.log(
            nodeList
                .flatMap(n=>this.collections.newList(n.esxi.states))
                .map(s=>s.name)
                .unique
                .toJSON()
        );
    }

    clusterSnapshotInfoCli(clusterId:string):void {
        this.clusters.esxiManagedClusterForId(clusterId).snapshotInfo()
            .then(r=>this.logESXIResponse(r))
            .catch(e=>this.cliHelper.logError(e));
    }

    clusterSnapshotApplyCli(clusterId:string, stateName:string):void {
        this.clusters.esxiManagedClusterForId(clusterId).revertToState(stateName)
            .then(r=>this.logESXIResponse(r))
            .catch(e=>this.cliHelper.logError(e));
    }

    clusterSnapshotCaptureCli(clusterId:string, snapshotName:string):void {
        this.clusters.esxiManagedClusterForId(clusterId).captureSnapshotNamed(snapshotName)
            .then(r=>this.logESXIResponse(r))
            .catch(e=>this.cliHelper.logError(e));
    }

    clusterSnapshotDeleteCli(clusterId:string, stateName:string):void {
        this.clusters.esxiManagedClusterForId(clusterId).deleteSnapshotsWithStateName(stateName)
            .then(r=>this.logESXIResponse(r))
            .catch(e=>this.cliHelper.logError(e));
    }

    private logESXIResponse(esxiResult:IESXIResponse):void {
        this.console.log(esxiResult.toString());
    }
}