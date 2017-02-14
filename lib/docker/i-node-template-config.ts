import {IJSONSerializable} from "../typed-json/i-json-serializable";
export interface INodeTemplateConfig extends IJSONSerializable {
    dockerImageName: string;
    type?: string;
    instances: number;
    diskProvider?: boolean;
    serviceNames?: Array<string>;
}