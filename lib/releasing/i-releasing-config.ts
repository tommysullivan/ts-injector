import {IJSONSerializable} from "../typed-json/i-json-serializable";
import {IReleaseConfig} from "./i-release-config";

export interface IReleasingConfig extends IJSONSerializable {
    releases:Array<IReleaseConfig>;
}