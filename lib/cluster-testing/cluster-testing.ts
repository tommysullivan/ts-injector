import {IClusterConfiguration} from "../clusters/i-cluster-configuration";
import {ICollections} from "../collections/i-collections";
import {ICucumberTestResult} from "../cucumber/i-cucumber-test-result";
import {IClusterVersionGraph} from "../versioning/i-cluster-version-graph";
import {MultiClusterTester} from "./multi-cluster-tester";
import {IUUIDGenerator} from "../uuid/i-uuid-generator";
import {IProcess} from "../node-js-wrappers/i-process";
import {ICucumber} from "../cucumber/i-cucumber";
import {IConsole} from "../console/i-console";
import {IFrameworkConfiguration} from "../framework/common/i-framework-configuration";
import {ClusterResultPreparer} from "./cluster-result-preparer";
import {IClusterTestingConfiguration} from "./i-cluster-testing-configuration";
import {IClusterTestResult} from "./i-cluster-test-result";
import {ClusterTestResult} from "./cluster-test-result";
import {IJSONSerializer} from "../typed-json/i-json-serializer";
import {IClusterTesting} from "./i-cluster-testing";
import {IClusters} from "../clusters/i-clusters";
import {IClusterResultPreparer} from "./i-cluster-result-preparer";
import {ITestRunnerEnvironment} from "../testing/i-test-runner-environment";
import {ITesting} from "../testing/i-testing";
import {IURLCalculator} from "../testing/i-url-calculator";
import {IFutures} from "../futures/i-futures";
import {IJSONSerializable} from "../typed-json/i-json-serializable";

export class ClusterTesting implements IClusterTesting {

    constructor(
        private clusterTestingConfiguration:IClusterTestingConfiguration,
        private futures:IFutures,
        private collections:ICollections,
        private clusters:IClusters,
        private uuidGenerator:IUUIDGenerator,
        private process:IProcess,
        private cucumber:ICucumber,
        private console:IConsole,
        private frameworkConfig:IFrameworkConfiguration,
        private jsonSerializer:IJSONSerializer,
        private testing:ITesting,
        private urlCalculator:IURLCalculator
    ) {}

    newMultiClusterTester():MultiClusterTester {
        return new MultiClusterTester(
            this.uuidGenerator,
            this.clusterTestingConfiguration,
            this.process,
            this.console,
            this.newClusterResultPreparer(),
            this.cucumber.newCucumberCli(),
            this.testing.newResultReporter(),
            this.jsonSerializer,
            this.urlCalculator,
            this.collections
        )
    }

    newClusterResultPreparer():IClusterResultPreparer {
        return new ClusterResultPreparer(
            this.clusters.newClusterLogCapturer(),
            this.console,
            this.collections,
            this.clusters,
            this,
            this.frameworkConfig,
            this.futures,
            this.jsonSerializer,
            this.testing,
            this.clusterTestingConfiguration.logsToCapture
        );
    }

    newClusterTestResult(cucumberTestResult:ICucumberTestResult,
                         frameworkConfiguration:IFrameworkConfiguration,
                         versionGraph:IClusterVersionGraph,
                         clusterConfiguration:IClusterConfiguration,
                         logs:IJSONSerializable,
                         id:string,
                         testRunnerEnvironment:ITestRunnerEnvironment):IClusterTestResult {
        return new ClusterTestResult(
            cucumberTestResult,
            frameworkConfiguration,
            versionGraph,
            clusterConfiguration,
            logs,
            id,
            this.jsonSerializer,
            testRunnerEnvironment
        );
    }
}