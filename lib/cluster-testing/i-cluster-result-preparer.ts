import {IFuture} from "../futures/i-future";
import {ICucumberTestResult} from "../cucumber/i-cucumber-test-result";
import {ITestResult} from "../testing/i-test-result";

export interface IClusterResultPreparer {
    prepareClusterResult(clusterId:string, cucumberTestResult:ICucumberTestResult, clusterResultId:string, testRunGUID:string):IFuture<ITestResult>;
}