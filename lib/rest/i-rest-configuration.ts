import {IJSONSerializable} from "../typed-json/i-json-serializable";

export interface IRestConfiguration extends IJSONSerializable {
    debugHTTP:boolean;
}