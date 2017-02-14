import {IDockerClusterTemplateConfiguration} from "./i-docker-cluster-template-confiuration";
import {IJSONObject} from "../typed-json/i-json-object";
import {INodeTemplateConfig} from "./i-node-template-config";
import {NodeTemplateConfig} from "./node-template-config";

export class DockerClusterConfig implements IDockerClusterTemplateConfiguration {

    constructor(
      private dockerImageJson:IJSONObject
    ){}

    get id():string {
          return this.dockerImageJson.stringPropertyNamed(`id`);
    }

    get maprVersion():string {
          return this.dockerImageJson.hasPropertyNamed(`maprVersion`) ?
              this.dockerImageJson.stringPropertyNamed(`maprVersion`)
              : null;
    }

    get nodeTemplates():Array<INodeTemplateConfig> {
        return this.dockerImageJson.listOfJSONObjectsNamed(`nodeTemplates`)
            .map(imageJson => new NodeTemplateConfig(imageJson)).toArray();
    }

    get defaultCPUsPerContainer():number {
        return this.dockerImageJson.numericPropertyNamed(`defaultCPUsPerContainer`);
    }

    get defaultMemoryPerContainer():number {
          return this.dockerImageJson.numericPropertyNamed(`defaultMemoryPerContainer`);
    }

    toJSON(): any {
        return this.dockerImageJson.toJSON();
    }
}