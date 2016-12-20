import {IESXINodeConfiguration} from "../esxi/configuration/i-esxi-node-configuration";
import {IOperatingSystemConfig} from "../operating-systems/i-operating-system-config";
import {IServiceGroupRefConfiguration} from "../services/i-service-group-ref-config";

export interface INodeConfiguration {
    host:string;
    username:string;
    password:string;
    operatingSystem:IOperatingSystemConfig;
    serviceNames:Array<string | IServiceGroupRefConfiguration>;
    name:string;
    esxi:IESXINodeConfiguration;
    toJSON():any;
}