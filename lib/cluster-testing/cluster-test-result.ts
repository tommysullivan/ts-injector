import {IClusterVersionGraph} from "../versioning/i-cluster-version-graph";
import {ICucumberTestResult} from "../cucumber/i-cucumber-test-result";
import {IClusterConfiguration} from "../clusters/i-cluster-configuration";
import {IList} from "../collections/i-list";
import {IFrameworkConfiguration} from "../framework/i-framework-configuration";
import {IClusterTestResult} from "./i-cluster-test-result";
import {IJSONSerializer} from "../typed-json/i-json-serializer";
import {INodeLog} from "./i-node-log";
import {ITestRunnerEnvironment} from "../testing/i-test-runner-environment";

export class ClusterTestResult implements IClusterTestResult {

    constructor(
        private cucumberTestResult:ICucumberTestResult,
        private frameworkConfiguration:IFrameworkConfiguration,
        private versionGraph:IClusterVersionGraph,
        private clusterConfiguration:IClusterConfiguration,
        private logs:IList<INodeLog>,
        private id:string,
        private jsonSerializer:IJSONSerializer,
        private testRunnerEnvironment:ITestRunnerEnvironment
    ) {}

    get clusterId():string { return this.clusterConfiguration.id; }

    toJSON():any {
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