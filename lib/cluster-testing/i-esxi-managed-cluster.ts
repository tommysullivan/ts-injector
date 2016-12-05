import {IESXIResponse} from "../esxi/i-esxi-response";
import {IFuture} from "../futures/i-future";
import {ISSHResult} from "../ssh/i-ssh-result";
import {IList} from "../collections/i-list";
import {IESXIAction} from "../esxi/i-esxi-action";

export interface IESXIManagedCluster {
    performESXIAction(esxiAction:IESXIAction):IFuture<IList<ISSHResult>>;
    snapshotInfo():IFuture<IESXIResponse>;
    revertToState(stateName:string):IFuture<IESXIResponse>;
    deleteSnapshotsWithStateName(stateName:string):IFuture<IESXIResponse>;
    captureSnapshotNamed(stateName:string):IFuture<IESXIResponse>;
    powerReset():IFuture<IESXIResponse>;
    powerOff():IFuture<IESXIResponse>;
}