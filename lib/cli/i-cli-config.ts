import {IJSONSerializable} from "../typed-json/i-json-serializable";

export interface ICliConfig extends IJSONSerializable {
    temporaryTestRunOutputFilePath:string;
}