import {IJSONSerializable} from "../../typed-json/i-json-serializable";

export interface IESXIServerConfiguration extends IJSONSerializable {
    id:string;
    host:string;
    username:string;
    password:string;
    type:string;
}