import {IJSONSerializable} from "../typed-json/i-json-serializable";
import {IMesosEnvironmentConfiguration} from "./i-mesos-environment-configuration";
import {IDockerClusterTemplateConfiguration} from "./i-docker-cluster-template-confiuration";
import {IList} from "../collections/i-list";

export interface IDockerInfrastructureConfiguration extends IJSONSerializable {
    dockerRepo:string;
    mesosClusters:Array<IMesosEnvironmentConfiguration>;
    dockerClusterTemplates:Array<IDockerClusterTemplateConfiguration>;
}