import {IFuture} from "../promise/i-future";
import {ICucumberTestResult} from "../cucumber/i-cucumber-test-result";

export interface IClusterResultPreparer {
    prepareAndSaveClusterResult(clusterId:string, cucumberTestResult:ICucumberTestResult, uniqueFileIdentifier:string, testRunGUID:string):IFuture<any>;
}