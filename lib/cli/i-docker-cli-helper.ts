import {IFuture} from "../futures/i-future";
export interface IDockerCliHelper {
    launchDockerImage(imageId:string):IFuture<string>;
    killDockerImage(imageId:string):IFuture<string>;
}