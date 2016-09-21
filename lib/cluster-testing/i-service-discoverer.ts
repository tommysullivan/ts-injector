import {INodeUnderTest} from "./i-node-under-test";
import {IFuture} from "../promise/i-future";
import {IClusterUnderTest} from "./i-cluster-under-test";

export interface IServiceDiscoverer {
    nodeHostingServiceViaDiscover(clusterUnderTest:IClusterUnderTest, serviceName:string):IFuture<INodeUnderTest>;
}