import {IJSONObject} from "../typed-json/i-json-object";
import {IDockerImageNameConfig} from "./i-docker-image-name-config";

export class DockerImageNameConfig implements IDockerImageNameConfig {
    constructor (
        private imageJSON:IJSONObject
    ){}

    get name(): string {
        return this.imageJSON.stringPropertyNamed(`name`)
    }

    get instances(): number {
        return this.imageJSON.numericPropertyNamed(`instances`);
    }

    get type(): string {
        return this.imageJSON.hasPropertyNamed(`type`) ?
            this.imageJSON.stringPropertyNamed(`type`)
            : null;
    }

    get diskProvider(): boolean {
        return this.imageJSON.hasPropertyNamed(`diskProvider`) ?
            this.imageJSON.booleanPropertyNamed(`diskProvider`) : null;
    }
}