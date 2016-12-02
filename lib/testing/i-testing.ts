import {ITestRunnerEnvironment} from "./i-test-runner-environment";
import {ITestResult} from "./i-test-result";
import {ICucumberTestResult} from "../cucumber/i-cucumber-test-result";
import {IResultReporter} from "./i-result-reporter";
import {IRelease} from "../releasing/i-release";
import {IPhase} from "../releasing/i-phase";
import {IURLCalculator} from "./i-url-calculator";

export interface ITesting {
    newTestRunnerEnvironment(testRunGUID:string):ITestRunnerEnvironment;
    newTestResult(testRunGUID:string, cucumberTestResult:ICucumberTestResult):ITestResult;
    newResultReporter():IResultReporter;
    newUrlCalculator():IURLCalculator;
    defaultReleasePhase:IPhase;
    defaultRelease:IRelease;
}