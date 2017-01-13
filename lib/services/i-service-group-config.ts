import {IJSONSerializable} from "../typed-json/i-json-serializable";

export interface IServiceGroupConfig extends IJSONSerializable {
    id:string;
    serviceNames:Array<string>;
}