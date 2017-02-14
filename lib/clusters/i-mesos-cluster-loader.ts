import {IFuture} from "../futures/i-future";
import {IClusterRunningInMesos} from "../docker/i-cluster-running-in-mesos";

export interface IClusterLoaderForMesosEnvironment {
    loadClusterRunningInMesos(marathonApplicationId:string, mesosEnvironmentId:string):IFuture<IClusterRunningInMesos>;
}