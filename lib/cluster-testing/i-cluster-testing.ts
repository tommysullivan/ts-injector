import {IClusterTestResult} from "./i-cluster-test-result";
import {IList} from "../collections/i-list";
import {IClusterConfiguration} from "../clusters/i-cluster-configuration";
import {IClusterVersionGraph} from "../versioning/i-cluster-version-graph";
import {IPhase} from "../releasing/i-phase";
import {INodeUnderTest} from "./i-node-under-test";
import {INodeConfiguration} from "../nodes/i-node-configuration";
import {IClusterUnderTest} from "./i-cluster-under-test";
import {ICucumberTestResult} from "../cucumber/i-cucumber-test-result";
import {IFrameworkConfiguration} from "../framework/i-framework-configuration";
import {INodeLog} from "./i-node-log";
import {IClusterLogCapturer} from "./i-cluster-log-capturer";
import {IClusterResultPreparer} from "./i-cluster-result-preparer";
import {IMultiClusterTester} from "./i-multi-cluster-tester";
import {IESXIManagedCluster} from "./i-esxi-managed-cluster";
import {IRelease} from "../releasing/i-release";
import {ITestRunnerEnvironment} from "../testing/i-test-runner-environment";

export interface IClusterTesting {
    clusterForId(clusterId:string):IClusterUnderTest;
    esxiManagedClusterForId(clusterId:string):IESXIManagedCluster;
    newMultiClusterTester():IMultiClusterTester;
    newClusterResultPreparer():IClusterResultPreparer;
    newClusterLogCapturer():IClusterLogCapturer;
    newClusterUnderTest(clusterConfiguration:IClusterConfiguration):IClusterUnderTest;
    newClusterInstaller();
    newNodeUnderTest(nodeConfiguration:INodeConfiguration):INodeUnderTest;
    newESXIManagedCluster(clusterConfiguration:IClusterConfiguration):IESXIManagedCluster;
    newNodeLog(nodeHost:string, logContent:Array<string>, logTitle:string):INodeLog;
    newClusterTestResult(cucumberTestResult:ICucumberTestResult,
                         frameworkConfiguration:IFrameworkConfiguration,
                         versionGraph:IClusterVersionGraph,
                         clusterConfiguration:IClusterConfiguration,
                         logs:IList<INodeLog>,
                         id:string,
                         testRunnerEnvironment:ITestRunnerEnvironment):IClusterTestResult;
}