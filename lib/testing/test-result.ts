import {ITestResult} from "./i-test-result";
import {ICucumberTestResult} from "../cucumber/i-cucumber-test-result";
import {ITestRunnerEnvironment} from "./i-test-runner-environment";
import {IFrameworkConfiguration} from "../framework/common/i-framework-configuration";
import {IJSONSerializer} from "../typed-json/i-json-serializer";
import {IJSONValue} from "../typed-json/i-json-value";

export class TestResult implements ITestResult {

    constructor(
        private cucumberTestResult:ICucumberTestResult,
        private testRunnerEnvironment:ITestRunnerEnvironment,
        private frameworkConfiguration:IFrameworkConfiguration,
        private jsonSerializer:IJSONSerializer
    ) {}

    get passed():boolean {
        return this.cucumberTestResult.passed;
    }

    toJSON():IJSONValue {
        const serialize = (o) => this.jsonSerializer.serialize(o);
        return {
            contentType: 'vnd/mapr.test-portal.test-result+json;v=1.0.0',
            cucumberTestResult: serialize(this.cucumberTestResult),
            frameworkConfiguration: serialize(this.frameworkConfiguration),
            passed: this.passed,
            id: this.testRunnerEnvironment.testRunGUID,
            testRunGUID: this.testRunnerEnvironment.testRunGUID,
            packageJsonOfSystemUnderTest: serialize(this.testRunnerEnvironment.packageJsonOfSystemUnderTest),
            jenkinsURL: this.testRunnerEnvironment.jenkinsURL,
            user: this.testRunnerEnvironment.user,
            gitCloneURL: this.testRunnerEnvironment.gitCloneURL,
            gitSHA: this.testRunnerEnvironment.gitSHA,
            testName: this.testRunnerEnvironment.testName
        };
    }
}