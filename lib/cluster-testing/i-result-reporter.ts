import {IFuture} from "../promise/i-future";
import {IClusterTestResult} from "./i-cluster-test-result";

export interface IResultReporter {
    reportResult(uniqueFileIdentifier:string, clusterTestResult:IClusterTestResult):IFuture<IClusterTestResult>;
}