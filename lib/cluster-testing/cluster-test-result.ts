import {IClusterVersionGraph} from "../versioning/i-cluster-version-graph";
import {ICucumberTestResult} from "../cucumber/i-cucumber-test-result";
import {IFrameworkConfiguration} from "../framework/common/i-framework-configuration";
import {IJSONSerializer} from "../typed-json/i-json-serializer";
import {ITestRunnerEnvironment} from "../testing/i-test-runner-environment";
import {IJSONSerializable} from "../typed-json/i-json-serializable";
import {IJSONValue} from "../typed-json/i-json-value";
import {ITestResult} from "../testing/i-test-result";

export class ClusterTestResult implements ITestResult {

    constructor(
        private cucumberTestResult:ICucumberTestResult,
        private frameworkConfiguration:IFrameworkConfiguration,
        private versionGraph:IClusterVersionGraph,
        private clusterConfiguration:IJSONSerializable,
        private logs:IJSONSerializable,
        private id:string,
        private jsonSerializer:IJSONSerializer,
        private testRunnerEnvironment:ITestRunnerEnvironment
    ) {}

    toJSON():IJSONValue {
        const serialize = (o) => this.jsonSerializer.serialize(o);
        return {
            contentType: 'vnd/mapr.test-portal.cluster-test-result+json;v=3.1.0',
            cucumberTestResult: serialize(this.cucumberTestResult),
            versionGraph: serialize(this.versionGraph),
            clusterConfiguration: serialize(this.clusterConfiguration),
            frameworkConfiguration: serialize(this.frameworkConfiguration),
            passed: this.passed,
            logs: serialize(this.logs),
            id: this.id,
            testRunGUID: this.testRunnerEnvironment.testRunGUID,
            packageJsonOfSystemUnderTest: serialize(this.testRunnerEnvironment.packageJsonOfSystemUnderTest),
            jenkinsURL: this.testRunnerEnvironment.jenkinsURL,
            user: this.testRunnerEnvironment.user,
            gitCloneURL: this.testRunnerEnvironment.gitCloneURL,
            gitSHA: this.testRunnerEnvironment.gitSHA
        }
    }

    toString() {
        return JSON.stringify(this.toJSON(), null, 3);
    }

    get passed():boolean {
        return this.cucumberTestResult.passed;
    }
}