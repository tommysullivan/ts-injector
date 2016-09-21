import {IClusterVersionGraph} from "../versioning/i-cluster-version-graph";
import {ICucumberTestResult} from "../cucumber/i-cucumber-test-result";
import {IClusterConfiguration} from "../clusters/i-cluster-configuration";
import {IList} from "../collections/i-list";
import {IJSONObject} from "../typed-json/i-json-object";
import {IFrameworkConfiguration} from "../framework/i-framework-configuration";
import {IClusterTestResult} from "./i-cluster-test-result";
import {IJSONSerializer} from "../typed-json/i-json-serializer";
import {INodeLog} from "./i-node-log";

export class ClusterTestResult implements IClusterTestResult {

    constructor(
        private cucumberTestResult:ICucumberTestResult,
        private frameworkConfiguration:IFrameworkConfiguration,
        private versionGraph:IClusterVersionGraph,
        private versionGraphError:string,
        private clusterConfiguration:IClusterConfiguration,
        private logs:IList<INodeLog>,
        private id:string,
        private testRunGUID:string,
        private packageJson:IJSONObject,
        private jsonSerializer:IJSONSerializer,
        private jenkinsURL?:string,
        private currentUser?:string,
        private gitCloneURL?:string,
        private gitSHA?:string)  {}

    get clusterId():string { return this.clusterConfiguration.id; }

    toJSON():any {
        const serialize = (o) => this.jsonSerializer.serialize(o);
        return {
            contentType: 'vnd/mapr.test-portal.cluster-test-result+json;v=3.1.0',
            cucumberTestResult: serialize(this.cucumberTestResult),
            versionGraph: serialize(this.versionGraph),
            versionGraphError: this.versionGraphError,
            clusterConfiguration: serialize(this.clusterConfiguration),
            frameworkConfiguration: serialize(this.frameworkConfiguration),
            passed: this.passed,
            logs: serialize(this.logs),
            id: this.id,
            testRunGUID: this.testRunGUID,
            packageJsonOfSystemUnderTest: serialize(this.packageJson),
            jenkinsURL: this.jenkinsURL,
            user: this.currentUser,
            gitCloneURL: this.gitCloneURL,
            gitSHA: this.gitSHA
        }
    }

    toString() {
        return JSON.stringify(this.toJSON(), null, 3);
    }

    get passed():boolean {
        return this.cucumberTestResult.passed;
    }
}