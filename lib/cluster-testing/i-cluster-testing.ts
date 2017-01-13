import {IClusterTestResult} from "./i-cluster-test-result";
import {IClusterConfiguration} from "../clusters/i-cluster-configuration";
import {IClusterVersionGraph} from "../versioning/i-cluster-version-graph";
import {ICucumberTestResult} from "../cucumber/i-cucumber-test-result";
import {IClusterResultPreparer} from "./i-cluster-result-preparer";
import {IMultiClusterTester} from "./i-multi-cluster-tester";
import {ITestRunnerEnvironment} from "../testing/i-test-runner-environment";
import {IJSONSerializable} from "../typed-json/i-json-serializable";
import {IFrameworkConfiguration} from "../framework/common/i-framework-configuration";

export interface IClusterTesting {
    newMultiClusterTester():IMultiClusterTester;
    newClusterResultPreparer():IClusterResultPreparer;
    newClusterTestResult(cucumberTestResult:ICucumberTestResult,
                         frameworkConfiguration:IFrameworkConfiguration,
                         versionGraph:IClusterVersionGraph,
                         clusterConfiguration:IClusterConfiguration,
                         logs:IJSONSerializable,
                         id:string,
                         testRunnerEnvironment:ITestRunnerEnvironment):IClusterTestResult;
}