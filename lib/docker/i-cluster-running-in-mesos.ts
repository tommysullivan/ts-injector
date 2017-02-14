import {ICluster} from "../clusters/i-cluster";
import {IFuture} from "../futures/i-future";

export interface IClusterRunningInMesos extends ICluster {
    destroy():IFuture<string>;
    marathonApplicationId:string;
    mesosEnvironmentId:string;
    id:string;
}