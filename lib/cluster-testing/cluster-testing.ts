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
import {ClusterUnderTestReferencer} from "./cluster-under-test-referencer";
import {IClusterUnderTestReferencer} from "./i-cluster-under-test-referencer";
import {IDocker} from "../docker/i-docker";
import {ITestResult} from "../testing/i-test-result";
import {IMultiClusterTester} from "./i-multi-cluster-tester";

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
        private urlCalculator:IURLCalculator,
        private docker:IDocker
    ) {}

    newMultiClusterTester():IMultiClusterTester {
        return new MultiClusterTester(
            this.uuidGenerator,
            this.process,
            this.console,
            this.newClusterResultPreparer(),
            this.cucumber.newCucumberCli(),
            this.testing.newResultReporter(),
            this.jsonSerializer,
            this.urlCalculator
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
            this.clusterTestingConfiguration.logsToCapture,
            this.docker
        );
    }

    newClusterTestResult(cucumberTestResult:ICucumberTestResult,
                         frameworkConfiguration:IFrameworkConfiguration,
                         versionGraph:IClusterVersionGraph,
                         clusterConfiguration:IJSONSerializable,
                         logs:IJSONSerializable,
                         id:string,
                         testRunnerEnvironment:ITestRunnerEnvironment):ITestResult {
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

    newClusterUnderTestReferencer():IClusterUnderTestReferencer {
        return new ClusterUnderTestReferencer(
            this.process,
        );
    }
}