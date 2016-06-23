import FrameworkConfiguration from "../framework/framework-configuration";
import IClusterVersionGraph from "../versioning/i-cluster-version-graph";
import ICucumberTestResult from "../cucumber/i-cucumber-test-result";
import ICucumberRunConfiguration from "../cucumber/i-cucumber-run-configuration";
import IClusterConfiguration from "../clusters/i-cluster-configuration";
import NodeLog from "./node-log";
import IList from "../collections/i-list";

export default class ClusterTestResult {

    constructor(
        private cucumberTestResult:ICucumberTestResult,
        private frameworkConfiguration:FrameworkConfiguration,
        private versionGraph:IClusterVersionGraph,
        private versionGraphError:string,
        private clusterConfiguration:IClusterConfiguration,
        private logs:IList<NodeLog>
    ) {}

    get clusterId():string { return this.clusterConfiguration.id; }

    toJSON() {
        return {
            contentType: 'vnd/mapr.test-portal.cluster-test-result+json;v=2.0.0',
            cucumberTestResult: this.cucumberTestResult.toJSON(),
            versionGraph: this.versionGraph ? this.versionGraph.toJSON() : null,
            versionGraphError: this.versionGraphError,
            clusterConfiguration: this.clusterConfiguration.toJSON(),
            frameworkConfiguration: this.frameworkConfiguration.toJSON(),
            passed: this.passed(),
            logs: this.logs.toJSON()
        }
    }

    toString() {
        return JSON.stringify(this.toJSON(), null, 3);
    }

    passed():boolean { return !this.cucumberTestResult.processResult.hasError(); }
}