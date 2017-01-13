import {INode} from "./i-node";
import {IFuture} from "../futures/i-future";
import {ICluster} from "./i-cluster";

export interface IServiceDiscoverer {
    nodeHostingServiceViaDiscover(clusterUnderTest:ICluster, serviceName:string):IFuture<INode>;
}