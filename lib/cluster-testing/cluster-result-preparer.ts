import {IConsole} from "../console/i-console";
import {ICollections} from "../collections/i-collections";
import {ICucumberTestResult} from "../cucumber/i-cucumber-test-result";
import {IFrameworkConfiguration} from "../framework/common/i-framework-configuration";
import {IClusters} from "../clusters/i-clusters";
import {IClusterResultPreparer} from "./i-cluster-result-preparer";
import {IClusterTesting} from "./i-cluster-testing";
import {IClusterLogCapturer} from "../clusters/i-cluster-log-capturer";
import {INodeLog} from "../clusters/i-node-log";
import {IClusterTestResult} from "./i-cluster-test-result";
import {IJSONSerializer} from "../typed-json/i-json-serializer";
import {ITesting} from "../testing/i-testing";
import {IFutures} from "../futures/i-futures";
import {IFuture} from "../futures/i-future";
import {IJSONValue} from "../typed-json/i-json-value";
import {ILogCaptureConfiguration} from "../clusters/i-log-capture-configuration";

export class ClusterResultPreparer implements IClusterResultPreparer {
    constructor(
        private clusterLogCapturer:IClusterLogCapturer,
        private console:IConsole,
        private collections:ICollections,
        private clusters:IClusters,
        private clusterTesting:IClusterTesting,
        private frameworkConfig:IFrameworkConfiguration,
        private futures:IFutures,
        private jsonSerializer:IJSONSerializer,
        private testing:ITesting,
        private logsToCapture:Array<ILogCaptureConfiguration>
    ) {}

    prepareClusterResult(clusterId:string, cucumberTestResult:ICucumberTestResult, clusterResultId:string, testRunGUID:string):IFuture<IClusterTestResult> {
        const testRunnerEnvironment = this.testing.newTestRunnerEnvironment(testRunGUID);
        const clusterConfiguration = this.clusters.clusterConfigurationWithId(clusterId);
        const cluster = this.clusters.clusterForId(clusterId);
        const futureLogs = this.clusterLogCapturer.captureLogs(cluster, this.logsToCapture)
            .catch(error => {
                this.console.warn(`Could not capture logs for cluster: ${error.toString()}`);
                return this.collections.newEmptyList<INodeLog>();
            })
            .then(logs => this.jsonSerializer.serialize(logs));

        const futureVersionGraph = cluster.versionGraph()
            .catch(error => {
                this.console.warn(`Could not capture version graph for cluster ${error.toString()}`);
                return null;
            })
            .then(versionGraph => this.jsonSerializer.serialize(versionGraph));

        return this.futures.newFutureListFromArray([futureLogs,futureVersionGraph])
            .then(results => {
                const [logs, versionGraph] = results.toArray();
                return this.clusterTesting.newClusterTestResult(
                    cucumberTestResult,
                    this.frameworkConfig,
                    versionGraph,
                    clusterConfiguration,
                    logs,
                    clusterResultId,
                    testRunnerEnvironment
                )
            });
    }
}