import {IDockerInfrastructureConfiguration} from "./i-docker-infrastructure-config";
import {IMesosEnvironmentConfiguration} from "./i-mesos-environment-configuration";
import {IDockerClusterTemplateConfiguration} from "./i-docker-cluster-template-confiuration";
import {IJSONObject} from "../typed-json/i-json-object";
import {MesosEnvironmentConfiguration} from "./mesos-environment-configuration";
import {DockerClusterConfig} from "./docker-cluster-config";
import {IList} from "../collections/i-list";

export class DockerInfrastructureConfiguration implements IDockerInfrastructureConfiguration {

    constructor(
      private dockerInfraJSON:IJSONObject
    ){}

    get dockerRepo():string {
        return this.dockerInfraJSON.stringPropertyNamed(`dockerRepo`);
    }

    get mesosClusters():Array<IMesosEnvironmentConfiguration> {
        return this.dockerInfraJSON.listOfJSONObjectsNamed('mesosEnvironments').map(
            dockerJSON=>new MesosEnvironmentConfiguration(dockerJSON)
        ).toArray();
    }

    get dockerClusterTemplates(): Array<IDockerClusterTemplateConfiguration>{
        return this.dockerImagesAsList.toArray();
    }

    get dockerImagesAsList(): IList<IDockerClusterTemplateConfiguration> {
        return this.dockerInfraJSON.listOfJSONObjectsNamed('dockerClusterTemplates').map(
            imageJSON=>new DockerClusterConfig(imageJSON)
        )
    }
}