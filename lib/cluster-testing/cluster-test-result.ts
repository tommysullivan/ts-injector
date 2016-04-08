import FrameworkConfiguration from "../framework/framework-configuration";
import IClusterVersionGraph from "../versioning/i-cluster-version-graph";
import ICucumberTestResult from "../cucumber/i-cucumber-test-result";
import ICucumberRunConfiguration from "../cucumber/i-cucumber-run-configuration";
import IClusterConfiguration from "../clusters/i-cluster-configuration";

export default class ClusterTestResult {

    private cucumberRunConfig:ICucumberRunConfiguration;
    private cucumberTestResult:ICucumberTestResult;
    private frameworkConfiguration:FrameworkConfiguration;
    private versionGraph:IClusterVersionGraph;
    private versionGraphError:string;
    clusterConfiguration:IClusterConfiguration;

    constructor(cucumberRunConfig:ICucumberRunConfiguration, cucumberTestResult:ICucumberTestResult, frameworkConfiguration:FrameworkConfiguration, versionGraph:IClusterVersionGraph, versionGraphError:string, clusterConfiguration:IClusterConfiguration) {
        this.cucumberRunConfig = cucumberRunConfig;
        this.cucumberTestResult = cucumberTestResult;
        this.frameworkConfiguration = frameworkConfiguration;
        this.versionGraph = versionGraph;
        this.versionGraphError = versionGraphError;
        this.clusterConfiguration = clusterConfiguration;
    }

    toJSON() {
        return {
            contentType: 'vnd/mapr.test-portal.cluster-test-result+json;v=2.0.0',
            cucumberTestResult: this.cucumberTestResult.toJSON(),
            versionGraph: this.versionGraph ? this.versionGraph.toJSON() : null,
            versionGraphError: this.versionGraphError,
            clusterConfiguration: this.clusterConfiguration.toJSON(),
            frameworkConfiguration: this.frameworkConfiguration.toJSON(),
            passed: this.passed()
        }
    }

    toString() {
        return JSON.stringify(this.toJSON(), null, 3);
    }

    passed():boolean { return !this.cucumberTestResult.processResult.hasError(); }
}