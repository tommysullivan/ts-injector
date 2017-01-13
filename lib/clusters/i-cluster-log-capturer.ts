import {INodeLog} from "./i-node-log";
import {IList} from "../collections/i-list";
import {IFuture} from "../futures/i-future";
import {ICluster} from "./i-cluster";
import {ILogCaptureConfiguration} from "./i-log-capture-configuration";

export interface IClusterLogCapturer {
    captureLogs(cluster:ICluster, logsToCapture:Array<ILogCaptureConfiguration>):IFuture<IList<INodeLog>>;
}