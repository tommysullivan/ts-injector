import {IJSONSerializable} from "../typed-json/i-json-serializable";

export interface ISSHConfiguration extends IJSONSerializable {
    writeCommandsToStdout:boolean;
    temporaryStorageLocation:string;
}