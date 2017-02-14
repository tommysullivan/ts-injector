import {IFuture} from "../futures/i-future";

export interface IDockerCliHelper {
    provisionCluster(imageId:string, mesosEnvironmentId:string):IFuture<string>;
    destroyCluster(clusterId:string):IFuture<string>;
}