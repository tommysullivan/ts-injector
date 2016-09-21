import {IESXINodeConfiguration} from "../esxi/configuration/i-esxi-node-configuration";
import {IOperatingSystemConfig} from "../operating-systems/i-operating-system-config";

export interface INodeConfiguration {
    host:string;
    username:string;
    password:string;
    operatingSystem:IOperatingSystemConfig;
    serviceNames:Array<string>;
    name:string;
    esxi:IESXINodeConfiguration;
    toJSON():any;
}