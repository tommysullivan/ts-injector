import IProcess from "../node-js-wrappers/i-process";
import IConsole from "../node-js-wrappers/i-console";
import CliHelper from "./cli-helper";
import IESXIResponse from "../esxi/i-esxi-response";
import Clusters from "../clusters/clusters";
import ClusterTesting from "../cluster-testing/cluster-testing";

export default class ClusterSnapshotCliHelper {
    private process:IProcess;
    private console:IConsole;
    private cliHelper:CliHelper;
    private clusters:Clusters;
    private clusterTesting:ClusterTesting;

    constructor(process:IProcess, console:IConsole, cliHelper:CliHelper, clusters:Clusters, clusterTesting:ClusterTesting) {
        this.process = process;
        this.console = console;
        this.cliHelper = cliHelper;
        this.clusters = clusters;
        this.clusterTesting = clusterTesting;
    }

    executeClusterSnapshotCli():void {
        try {
            const actionName = this.process.getArgvOrThrow('action', 4);
            if(actionName=='states') {
                this.cliHelper.verifyFillerWord('for', 5);
                const clusterId = this.process.getArgvOrThrow('clusterId', 6);
                this.console.log(
                    this.clusters.clusterConfigurationWithId(clusterId)
                        .nodes
                        .flatMap(n=>n.esxiNodeConfiguration.states)
                        .map(s=>s.name)
                        .unique()
                        .toJSONString()
                );
            }
            else if(actionName=='info') {
                this.cliHelper.verifyFillerWord('for', 5);
                const clusterId = this.process.getArgvOrThrow('clusterId', 6);
                this.clusterTesting.esxiManagedClusterForId(clusterId).snapshotInfo()
                    .then(r=>this.logESXIResponse(r))
                    .catch(e=>this.cliHelper.logError(e));
            }
            else if(actionName=='capture') {
                const snapshotName = this.process.getArgvOrThrow('snapshotName', 5);
                this.cliHelper.verifyFillerWord('from', 6);
                const clusterId = this.process.getArgvOrThrow('clusterId', 7);
                this.clusterTesting.esxiManagedClusterForId(clusterId).captureSnapshotNamed(snapshotName)
                    .then(r=>this.logESXIResponse(r))
                    .catch(e=>this.cliHelper.logError(e));
            }
            else if(actionName=='apply') {
                const stateName = this.process.getArgvOrThrow('stateName', 5);
                this.cliHelper.verifyFillerWord('onto', 6);
                const clusterId = this.process.getArgvOrThrow('clusterId', 7);
                this.clusterTesting.esxiManagedClusterForId(clusterId).revertToState(stateName)
                    .then(r=>this.logESXIResponse(r))
                    .catch(e=>this.cliHelper.logError(e));
            }
            else if(actionName=='delete') {
                const stateName = this.process.getArgvOrThrow('stateName', 5);
                this.cliHelper.verifyFillerWord('from', 6);
                const clusterId = this.process.getArgvOrThrow('clusterId', 7);
                this.clusterTesting.esxiManagedClusterForId(clusterId).deleteSnapshotsWithStateName(stateName)
                    .then(r=>this.logESXIResponse(r))
                    .catch(e=>this.cliHelper.logError(e));
            }
            else throw new Error(`invalid action ${actionName}`);
        }
        catch(e) {
            this.logSnapshotUsage();
            throw e;
        }
    }

    private logSnapshotUsage():void {
        this.console.log([
            '',
            'Usage:',
            `${this.process.processName()} cluster snapshot [action]`,
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
    }

    private logESXIResponse(esxiResult:IESXIResponse):void {
        this.console.log(esxiResult.toJSONString());
    }
}