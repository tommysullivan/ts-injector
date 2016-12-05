import {INodeLog} from "./i-node-log";
import {IList} from "../collections/i-list";
import {IFuture} from "../futures/i-future";
import {IClusterUnderTest} from "./i-cluster-under-test";

export interface IClusterLogCapturer {
    captureLogs(cluster:IClusterUnderTest):IFuture<IList<INodeLog>>;
}