import {IJSONSerializable} from "../typed-json/i-json-serializable";

export interface IOpenTSDBConfiguration extends IJSONSerializable {
    openTSDBQueryPathTemplate:string;
    openTSDBUrlTemplate:string;
}