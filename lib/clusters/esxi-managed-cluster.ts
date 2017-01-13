import {IClusterConfiguration} from "./i-cluster-configuration";
import {IESXI} from "../esxi/i-esxi";
import {IESXIAction} from "../esxi/i-esxi-action";
import {IFuture} from "../futures/i-future";
import {IList} from "../collections/i-list";
import {IESXIResponse} from "../esxi/i-esxi-response";
import {ISSHResult} from "../ssh/i-ssh-result";
import {IESXIManagedCluster} from "./i-esxi-managed-cluster";
import {IESXINodeConfiguration} from "../esxi/configuration/i-esxi-node-configuration";
import {IFutures} from "../futures/i-futures";

export class ESXIManagedCluster implements IESXIManagedCluster {
    constructor(
        private clusterConfiguration:IClusterConfiguration,
        private esxi:IESXI,
        private futures:IFutures
    ) {}

    private snapshotIdFromStateName(esxiNodeConfiguration:IESXINodeConfiguration, stateName:string):number {
        const validStateNamesString = esxiNodeConfiguration.states.map(s=>s.name).join(',');
        const snapshotId = esxiNodeConfiguration.states
            .filter(s=>s.name==stateName)[0].snapshotId;
        if(snapshotId==null) throw new Error(
            `Could not find snapshot id for state name ${stateName}. Valid states: ${validStateNamesString}`
        );
        return snapshotId;
    }

    performESXIAction(esxiAction:IESXIAction):IFuture<IList<ISSHResult>> {
        const esxiServerConfig = this.esxi.esxiServerConfigurationForId(
            this.clusterConfiguration.esxiServerId
        );
        const esxiActionPromises = this.clusterConfiguration.nodes.map(
            n=>{
                const esxiClient = this.esxi.newESXIClient(
                    esxiServerConfig.host,
                    esxiServerConfig.username,
                    esxiServerConfig.password,
                    n.esxi.id
                );
                return esxiAction(esxiClient, n);
            }
        );
        return this.futures.newFutureListFromArray(esxiActionPromises);
    }

    snapshotInfo():IFuture<IESXIResponse> {
        return this.performESXIAction((e,n)=>e.snapshotInfo());
    }

    revertToState(stateName:string):IFuture<IESXIResponse> {
        return this
            .performESXIAction(
                (e,n) => e.restoreSnapshot(this.snapshotIdFromStateName(n.esxi, stateName))
            )
            .then(()=>this.performESXIAction((e,n)=>e.powerOn()));
    }

    deleteSnapshotsWithStateName(stateName:string):IFuture<IESXIResponse> {
        return this.performESXIAction((e,n)=>e.removeSnapshot(this.snapshotIdFromStateName(n.esxi, stateName)));
    }

    captureSnapshotNamed(stateName:string):IFuture<IESXIResponse> {
        return this.performESXIAction((e,n)=>e.captureStateAsSnapshot(stateName));
    }

    powerReset():IFuture<IESXIResponse> {
        return this.performESXIAction((e,n)=>e.powerReset());
    }

    powerOff():IFuture<IESXIResponse> {
        return this.performESXIAction((e,n)=>e.powerOff());
    }
}