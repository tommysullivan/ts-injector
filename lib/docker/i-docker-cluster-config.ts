import {IJSONSerializable} from "../typed-json/i-json-serializable";
import {IDockerImageNameConfig} from "./i-docker-image-name-config";

export interface IDockerClusterConfiguration extends IJSONSerializable {
    id:string;
    operatingSystem:string;
    operatingSystemVersion:string;
    maprVersion?:string;
    nodes?:number;
    templateId?:string;
    imageNames:Array<IDockerImageNameConfig>;
    defaultCPUsPerContainer:number;
    defaultMemoryPerContainer:number;
}