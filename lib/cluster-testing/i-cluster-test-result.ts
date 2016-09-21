import {IJSONSerializable} from "../typed-json/i-json-serializable";

export interface IClusterTestResult extends IJSONSerializable {
    clusterId:string;
    passed:boolean;
}