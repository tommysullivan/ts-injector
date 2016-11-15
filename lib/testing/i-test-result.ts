import {IJSONSerializable} from "../typed-json/i-json-serializable";

export interface ITestResult extends IJSONSerializable {
    passed:boolean;
}