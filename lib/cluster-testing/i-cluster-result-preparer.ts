import {IFuture} from "../promise/i-future";
import {ICucumberTestResult} from "../cucumber/i-cucumber-test-result";
import {IClusterTestResult} from "./i-cluster-test-result";

export interface IClusterResultPreparer {
    prepareClusterResult(clusterId:string, cucumberTestResult:ICucumberTestResult, clusterResultId:string, testRunGUID:string):IFuture<IClusterTestResult>;
}