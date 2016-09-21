import {INodeConfiguration} from "./../nodes/i-node-configuration";
import {IJSONSerializable} from "../typed-json/i-json-serializable";

export interface IClusterConfiguration extends IJSONSerializable {
    id:string;
    name:string;
    nodes:Array<INodeConfiguration>;
    esxiServerId?:string;
}