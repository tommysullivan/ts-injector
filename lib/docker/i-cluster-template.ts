import {IFuture} from "../futures/i-future";
import {IMesosEnvironment} from "./i-mesos-environment";
import {IClusterRunningInMesos} from "./i-cluster-running-in-mesos";

export interface IClusterTemplate {
    provision(targetEnvironment:IMesosEnvironment):IFuture<IClusterRunningInMesos>;
}