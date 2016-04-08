import IClusterConfiguration from "../clusters/i-cluster-configuration";
import IPromiseFactory from "../promise/i-promise-factory";
import IESXI from "../esxi/i-esxi";
import IESXIAction from "../esxi/i-esxi-action";
import IThenable from "../promise/i-thenable";
import IList from "../collections/i-list";
import IESXIResponse from "../esxi/i-esxi-response";
import ISSHResult from "../ssh/i-ssh-result";

export default class ESXIManagedCluster {
    private clusterConfiguration:IClusterConfiguration;
    private esxi:IESXI;
    private promiseFactory:IPromiseFactory;

    constructor(clusterConfiguration:IClusterConfiguration, esxi:IESXI, promiseFactory:IPromiseFactory) {
        this.clusterConfiguration = clusterConfiguration;
        this.esxi = esxi;
        this.promiseFactory = promiseFactory;
    }

    performESXIAction(esxiAction:IESXIAction):IThenable<IList<ISSHResult>> {
        var esxiServerConfig = this.clusterConfiguration.esxiServerConfiguration;
        var esxiActionPromises = this.clusterConfiguration.nodes.map(
            n=>{
                var esxiClient = this.esxi.newESXIClient(
                    esxiServerConfig.host,
                    esxiServerConfig.username,
                    esxiServerConfig.password,
                    n.esxiNodeConfiguration.id
                );
                return esxiAction(esxiClient, n);
            }
        );
        return this.promiseFactory.newGroupPromise(esxiActionPromises);
    }

    snapshotInfo():IThenable<IESXIResponse> {
        return this.performESXIAction((e,n)=>e.snapshotInfo());
    }

    revertToState(stateName:string):IThenable<IESXIResponse> {
        return this.performESXIAction((e,n)=>e.restoreSnapshot(n.snapshotIdFromStateName(stateName)))
            .then(()=>this.performESXIAction((e,n)=>e.powerOn()));
    }

    deleteSnapshotsWithStateName(stateName:string):IThenable<IESXIResponse> {
        return this.performESXIAction((e,n)=>e.removeSnapshot(n.snapshotIdFromStateName(stateName)));
    }

    captureSnapshotNamed(stateName:string):IThenable<IESXIResponse> {
        return this.performESXIAction((e,n)=>e.captureStateAsSnapshot(stateName));
    }

    powerReset():IThenable<IESXIResponse> {
        return this.performESXIAction((e,n)=>e.powerReset());
    }
}