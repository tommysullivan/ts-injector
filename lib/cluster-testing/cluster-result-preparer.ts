import {IConsole} from "../console/i-console";
import {ICollections} from "../collections/i-collections";
import {ICucumberTestResult} from "../cucumber/i-cucumber-test-result";
import {IFrameworkConfiguration} from "../framework/common/i-framework-configuration";
import {IClusters} from "../clusters/i-clusters";
import {IClusterResultPreparer} from "./i-cluster-result-preparer";
import {IClusterTesting} from "./i-cluster-testing";
import {IClusterLogCapturer} from "../clusters/i-cluster-log-capturer";
import {INodeLog} from "../clusters/i-node-log";
import {IJSONSerializer} from "../typed-json/i-json-serializer";
import {ITesting} from "../testing/i-testing";
import {IFutures} from "../futures/i-futures";
import {IFuture} from "../futures/i-future";
import {ILogCaptureConfiguration} from "../clusters/i-log-capture-configuration";
import {IDocker} from "../docker/i-docker";
import {ITestResult} from "../testing/i-test-result";

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
        private logsToCapture:Array<ILogCaptureConfiguration>,
        private docker:IDocker
    ) {}

    prepareClusterResult(clusterId:string, cucumberTestResult:ICucumberTestResult, clusterResultId:string, testRunGUID:string):IFuture<ITestResult> {
        const testRunnerEnvironment = this.testing.newTestRunnerEnvironment(testRunGUID);

        const futureCluster = this.clusters.allIds.contain(clusterId)
            ? this.futures.newFutureForImmediateValue(this.clusters.clusterForId(clusterId))
            : this.docker.newMesosEnvironmentFromConfig(clusterId.split(`:`)[0]).loadCluster(clusterId.split(`:`)[1]);

        const futureClusterConfiguration = this.clusters.allIds.contain(clusterId)
            ? this.futures.newFutureForImmediateValue(this.clusters.clusterConfigurationWithId(clusterId))
            : futureCluster.then(cluster => this.docker.newMesosClusterConfiguration(clusterId, clusterId.split(`:`)[1], cluster.nodes));

        const futureLogs = futureCluster.then(cluster => this.clusterLogCapturer.captureLogs(cluster, this.logsToCapture)
            .catch(error => {
                this.console.warn(`Could not capture logs for cluster: ${error.toString()}`);
                return this.collections.newEmptyList<INodeLog>();
            })
            .then(logs => this.jsonSerializer.serialize(logs)));

        const futureVersionGraph = futureCluster.then(cluster => cluster.versionGraph()
            .catch(error => {
                this.console.warn(`Could not capture version graph for cluster ${error.toString()}`);
                return null;
            })
            .then(versionGraph => this.jsonSerializer.serialize(versionGraph)));

        return this.futures.newFutureListFromArray([futureLogs,futureVersionGraph, futureClusterConfiguration])
            .then(results => {
                const [logs, versionGraph, futureClusterConfiguration ] = results.toArray();
                return this.clusterTesting.newClusterTestResult(
                    cucumberTestResult,
                    this.frameworkConfig,
                    versionGraph,
                    futureClusterConfiguration,
                    logs,
                    clusterResultId,
                    testRunnerEnvironment
                )
            });
    }
}