import {IDockerCliHelper} from "./i-docker-cli-helper";
import {IDockerLauncher} from "../docker/i-docker-launcher";
import {IFuture} from "../futures/i-future";

export class DockerCliHelper implements IDockerCliHelper {

    constructor(
        private dockerLauncher:IDockerLauncher
    ){}

    launchDockerImage(dockerId: string): IFuture<string> {
        return this.dockerLauncher.launch(dockerId);
    }

    killDockerImage(dockerId: string): IFuture<string> {
       return this.dockerLauncher.killStartedImages(dockerId);
    }
}