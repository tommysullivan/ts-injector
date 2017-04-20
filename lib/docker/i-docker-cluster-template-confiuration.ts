import {IJSONSerializable} from "../typed-json/i-json-serializable";
import {INodeTemplateConfig} from "./i-node-template-config";
import {IOperatingSystemConfig} from "../operating-systems/i-operating-system-config";

export interface IDockerClusterTemplateConfiguration extends IJSONSerializable {
    id:string;
    maprVersion?:string;
    nodeTemplates:Array<INodeTemplateConfig>;
    defaultCPUsPerContainer:number;
    defaultMemoryPerContainer:number;
    defaultConstraints?: Array<string>;
    defaultOperatingSystem?: IOperatingSystemConfig;
}