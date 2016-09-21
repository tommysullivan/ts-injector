import {ICucumberRunConfiguration} from "./i-cucumber-run-configuration";
import {ICucumberTestResult} from "./i-cucumber-test-result";
import {IFuture} from "../promise/i-future";

export interface ICucumberRunner {
    runCucumber(cucumberRunConfiguration:ICucumberRunConfiguration):IFuture<ICucumberTestResult>;
}