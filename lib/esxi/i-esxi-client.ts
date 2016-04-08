import IESXIResponse from "./i-esxi-response";
import IThenable from "../promise/i-thenable";

interface IESXIClient {
    restoreSnapshot(snapshotID:number):IThenable<IESXIResponse>;
    removeSnapshot(snapshotID:number):IThenable<IESXIResponse>;
    captureStateAsSnapshot(snapshotName:string):IThenable<IESXIResponse>;
    snapshotInfo():IThenable<IESXIResponse>;
    powerOn():IThenable<IESXIResponse>;
    powerReset():IThenable<IESXIResponse>;
    powerOff():IThenable<IESXIResponse>;
}

export default IESXIClient;