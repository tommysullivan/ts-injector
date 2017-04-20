import {IJSONSerializable} from "../typed-json/i-json-serializable";
import {IOperatingSystemConfig} from "../operating-systems/i-operating-system-config";
export interface INodeTemplateConfig extends IJSONSerializable {
    dockerImageName: string;
    type?: string;
    instances: number;
    diskProvider?: boolean;
    serviceNames?: Array<string>;
    constraints?: Array<string>;
    operatingSystem?: IOperatingSystemConfig;
}