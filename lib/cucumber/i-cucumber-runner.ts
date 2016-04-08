import ICucumberRunConfiguration from "./i-cucumber-run-configuration";
import ICucumberTestResult from "./i-cucumber-test-result";
import IThenable from "../promise/i-thenable";

interface ICucumberRunner {
    runCucumber(cucumberRunConfiguration:ICucumberRunConfiguration):IThenable<ICucumberTestResult>;
}

export default ICucumberRunner;