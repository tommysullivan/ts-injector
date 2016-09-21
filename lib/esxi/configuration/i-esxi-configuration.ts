import {IJSONSerializable} from "../../typed-json/i-json-serializable";
import {IESXIServerConfiguration} from "./i-esxi-server-configuration";

export interface IESXIConfiguration extends IJSONSerializable {
    servers:Array<IESXIServerConfiguration>;
}