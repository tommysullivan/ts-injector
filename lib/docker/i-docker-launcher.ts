import {IJSONObject} from "../typed-json/i-json-object";
import {IDockerImageNameConfig} from "./i-docker-image-name-config";
import {IList} from "../collections/i-list";
import {IDictionary} from "../collections/i-dictionary";
import {IFuture} from "../futures/i-future";

export interface IDockerLauncher {
    launch(dockerId:string):IFuture<string>;
    generateJsonToLaunchDocker(imageName:IDockerImageNameConfig, envVariables:IDictionary<string>):IJSONObject;
    getIPForImage(applicationId:string):string;
    currentDockerImageNames:IList<IDockerImageNameConfig>;
    killStartedImages(imageId:string):IFuture<string>;
}