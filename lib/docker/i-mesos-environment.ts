import {IClusterRunningInMesos} from "./i-cluster-running-in-mesos";
import {IFuture} from "../futures/i-future";
import {IMarathonRestClient} from "../marathon/i-marathon-rest-client";
import {ISSHSession} from "../ssh/i-ssh-session";
import {IList} from "../collections/i-list";

export interface IMesosEnvironment {
    loadCluster(marathonApplicationId:string):IFuture<IClusterRunningInMesos>;
    getMarathonRestClient():IMarathonRestClient;
    getDockerSSHSession(): IFuture<ISSHSession>;
    dockerVolumeLocalPath:string;
    dockerVolumeMountPath:string;
    taskStateWithTimeout(marathonApplicationId: string, timeOut:number, retryAttempts:number):IFuture<string>;
    environmentId:string;
    destroyGroupOrImage(imageIDOnMarathon:string):IFuture<string>;
    killAllApps():IFuture<IList<any>>;
}