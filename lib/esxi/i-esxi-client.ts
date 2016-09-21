import {IESXIResponse} from "./i-esxi-response";
import {IFuture} from "../promise/i-future";

export interface IESXIClient {
    restoreSnapshot(snapshotID:number):IFuture<IESXIResponse>;
    removeSnapshot(snapshotID:number):IFuture<IESXIResponse>;
    captureStateAsSnapshot(snapshotName:string):IFuture<IESXIResponse>;
    snapshotInfo():IFuture<IESXIResponse>;
    powerOn():IFuture<IESXIResponse>;
    powerReset():IFuture<IESXIResponse>;
    powerOff():IFuture<IESXIResponse>;
}