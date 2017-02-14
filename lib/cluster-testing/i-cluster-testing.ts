import {IClusterConfiguration} from "../clusters/i-cluster-configuration";
import {IClusterVersionGraph} from "../versioning/i-cluster-version-graph";
import {ICucumberTestResult} from "../cucumber/i-cucumber-test-result";
import {IClusterResultPreparer} from "./i-cluster-result-preparer";
import {IMultiClusterTester} from "./i-multi-cluster-tester";
import {ITestRunnerEnvironment} from "../testing/i-test-runner-environment";
import {IJSONSerializable} from "../typed-json/i-json-serializable";
import {IFrameworkConfiguration} from "../framework/common/i-framework-configuration";
import {IClusterUnderTestReferencer} from "./i-cluster-under-test-referencer";
import {ITestResult} from "../testing/i-test-result";

export interface IClusterTesting {
    newClusterUnderTestReferencer():IClusterUnderTestReferencer;
    newMultiClusterTester():IMultiClusterTester;
    newClusterResultPreparer():IClusterResultPreparer;
    newClusterTestResult(cucumberTestResult:ICucumberTestResult,
                         frameworkConfiguration:IFrameworkConfiguration,
                         versionGraph:IClusterVersionGraph,
                         clusterConfiguration:IJSONSerializable,
                         logs:IJSONSerializable,
                         id:string,
                         testRunnerEnvironment:ITestRunnerEnvironment):ITestResult;
}