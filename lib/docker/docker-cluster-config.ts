import {IDockerClusterConfiguration} from "./i-docker-cluster-config";
import {IJSONObject} from "../typed-json/i-json-object";
import {IDockerImageNameConfig} from "./i-docker-image-name-config";
import {DockerImageNameConfig} from "./docker-image-name-config";
import {IList} from "../collections/i-list";

export class DockerClusterConfig implements IDockerClusterConfiguration {

    constructor(
      private dockerImageJson:IJSONObject
    ){}

    get id():string {
          return this.dockerImageJson.stringPropertyNamed(`id`);
    }

    get operatingSystem():string {
          return this.dockerImageJson.stringPropertyNamed(`operatingSystem`);
    }

    get operatingSystemVersion():string {
        return this.dockerImageJson.stringPropertyNamed(`operatingSystemVersion`);
    }

    get maprVersion():string {
          return this.dockerImageJson.hasPropertyNamed(`maprVersion`) ?
              this.dockerImageJson.stringPropertyNamed(`maprVersion`)
              : null;
    }

    get nodes():number {
        return this.dockerImageJson.hasPropertyNamed(`nodes`) ?
            this.dockerImageJson.numericPropertyNamed(`nodes`)
            : this.imageNameAsList.map(i => i.instances).sum;
    }

    get templateId():string {
        return this.dockerImageJson.hasPropertyNamed(`templateId`) ?
            this.dockerImageJson.stringPropertyNamed(`templateId`)
            : null;
    }

    get imageNameAsList():IList<IDockerImageNameConfig> {
        return this.dockerImageJson.listOfJSONObjectsNamed(`imageNames`)
            .map(imageJson => new DockerImageNameConfig(imageJson));
    }

    get imageNames():Array<IDockerImageNameConfig> {
        return this.imageNameAsList.toArray();
    }

    get defaultCPUsPerContainer():number {
        return this.dockerImageJson.numericPropertyNamed(`defaultCPUsPerContainer`);
    }

    get defaultMemoryPerContainer():number {
          return this.dockerImageJson.numericPropertyNamed(`defaultMemoryPerContainer`);
    }

    toJSON(): any {
        return null;
    }
}