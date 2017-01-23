import {IDockerInfrastructureConfiguration} from "./i-docker-infrastructure-config";
import {IMesosClusterConfiguration} from "./i-mesos-cluster-config";
import {IDockerClusterConfiguration} from "./i-docker-cluster-config";
import {IJSONObject} from "../typed-json/i-json-object";
import {MesosClusterConfig} from "./mesos-cluster-config";
import {DockerClusterConfig} from "./docker-cluster-config";
import {IList} from "../collections/i-list";

export class DockerInfrastructureConfiguration implements IDockerInfrastructureConfiguration {

    constructor(
      private dockerInfraJSON:IJSONObject
    ){}

    get dockerRepo():string {
        return this.dockerInfraJSON.stringPropertyNamed(`dockerRepo`);
    }

    get mesosClusters():Array<IMesosClusterConfiguration> {
        return this.dockerInfraJSON.listOfJSONObjectsNamed('mesosClusters').map(
            dockerJSON=>new MesosClusterConfig(dockerJSON)
        ).toArray();
    }

    get dockerClusters(): Array<IDockerClusterConfiguration>{
        return this.dockerImagesAsList.toArray();
    }

    get dockerImagesAsList(): IList<IDockerClusterConfiguration> {
        return this.dockerInfraJSON.listOfJSONObjectsNamed('dockerClusters').map(
            imageJSON=>new DockerClusterConfig(imageJSON)
        )
    }
}