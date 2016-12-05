import {IClusterConfiguration} from "../clusters/i-cluster-configuration";
import {IClusterUnderTest} from "./i-cluster-under-test";
import {ClusterUnderTest} from "./cluster-under-test";
import {IPromiseFactory} from "../promise/i-promise-factory";
import {INodeConfiguration} from "../nodes/i-node-configuration";
import {INodeUnderTest} from "./i-node-under-test";
import {NodeUnderTest} from "./node-under-test";
import {ISSHClient} from "../ssh/i-ssh-client";
import {ICollections} from "../collections/i-collections";
import {ESXIManagedCluster} from "./esxi-managed-cluster";
import {IESXI} from "../esxi/i-esxi";
import {ICucumberTestResult} from "../cucumber/i-cucumber-test-result";
import {IClusterVersionGraph} from "../versioning/i-cluster-version-graph";
import {IVersioning} from "../versioning/i-versioning";
import {IPackaging} from "../packaging/i-packaging";
import {MultiClusterTester} from "./multi-cluster-tester";
import {IUUIDGenerator} from "../uuid/i-uuid-generator";
import {IProcess} from "../node-js-wrappers/i-process";
import {ICucumber} from "../cucumber/i-cucumber";
import {IConsole} from "../node-js-wrappers/i-console";
import {ClusterLogCapturer} from "./cluster-log-capturer";
import {IList} from "../collections/i-list";
import {NodeLog} from "./node-log";
import {IFrameworkConfiguration} from "../framework/i-framework-configuration";
import {ClusterResultPreparer} from "./cluster-result-preparer";
import {IClusterTestingConfiguration} from "./i-cluster-testing-configuration";
import {IClusterTestResult} from "./i-cluster-test-result";
import {ClusterTestResult} from "./cluster-test-result";
import {IJSONSerializer} from "../typed-json/i-json-serializer";
import {IClusterTesting} from "./i-cluster-testing";
import {IMCS} from "../mcs/i-mcs";
import {IOpenTSDB} from "../open-tsdb/i-open-tsdb";
import {IInstaller} from "../installer/i-installer";
import {IServiceDiscoverer} from "./i-service-discoverer";
import {IClusters} from "../clusters/i-clusters";
import {IElasticsearch} from "../elasticsearch/i-elasticsearch";
import {ClusterInstaller} from "../installer/cluster-installer";
import {INodeLog} from "./i-node-log";
import {IOperatingSystems} from "../operating-systems/i-operating-systems";
import {IClusterResultPreparer} from "./i-cluster-result-preparer";
import {ITestRunnerEnvironment} from "../testing/i-test-runner-environment";
import {ITesting} from "../testing/i-testing";
import {IClusterLogCapturer} from "./i-cluster-log-capturer";
import {IFileSystem} from "../node-js-wrappers/i-filesystem";
import {IURLCalculator} from "../testing/i-url-calculator";

export class ClusterTesting implements IClusterTesting {

    constructor(
        private clusterTestingConfiguration:IClusterTestingConfiguration,
        private promiseFactory:IPromiseFactory,
        private sshClient:ISSHClient,
        private collections:ICollections,
        private versioning:IVersioning,
        private mcs:IMCS,
        private openTSDB:IOpenTSDB,
        private installer:IInstaller,
        private elasticSearch:IElasticsearch,
        private serviceDiscoverer:IServiceDiscoverer,
        private esxi:IESXI,
        private clusters:IClusters,
        private packaging:IPackaging,
        private uuidGenerator:IUUIDGenerator,
        private process:IProcess,
        private cucumber:ICucumber,
        private console:IConsole,
        private frameworkConfig:IFrameworkConfiguration,
        private jsonSerializer:IJSONSerializer,
        private operatingSystems:IOperatingSystems,
        private testing:ITesting,
        private fileSystem:IFileSystem,
        private urlCalculator:IURLCalculator
    ) {}

    clusterForId(clusterId:string):IClusterUnderTest {
        return this.newClusterUnderTest(
            this.clusters.clusterConfigurationWithId(clusterId)
        );
    }

    esxiManagedClusterForId(clusterId:string):ESXIManagedCluster {
        return this.newESXIManagedCluster(
            this.clusters.clusterConfigurationWithId(clusterId)
        );
    }
    
    newMultiClusterTester():MultiClusterTester {
        return new MultiClusterTester(
            this.uuidGenerator,
            this.clusterTestingConfiguration,
            this.clusters,
            this.process,
            this.console,
            this.promiseFactory,
            this.newClusterResultPreparer(),
            this.cucumber.newCucumberCli(),
            this.testing.newResultReporter(),
            this.jsonSerializer,
            this.urlCalculator
        )
    }

    newClusterResultPreparer():IClusterResultPreparer {
        return new ClusterResultPreparer(
            this.newClusterLogCapturer(),
            this.console,
            this.collections,
            this.clusters,
            this,
            this.frameworkConfig,
            this.promiseFactory,
            this.jsonSerializer,
            this.testing
        );
    }

    newClusterLogCapturer():IClusterLogCapturer {
        return new ClusterLogCapturer(
            this.promiseFactory,
            this,
            this.collections,
            this.clusterTestingConfiguration.logsToCapture
        );
    }

    newNodeLog(nodeHost:string, logContent:Array<string>, logTitle:string):INodeLog {
        return new NodeLog(
            nodeHost,
            logContent,
            logTitle
        );
    }

    newClusterUnderTest(clusterConfiguration:IClusterConfiguration):IClusterUnderTest {
        const nodesUnderTest = this.collections.newList(
            clusterConfiguration.nodes.map(n=>this.newNodeUnderTest(n))
        );
        return new ClusterUnderTest(
            this.clusterTestingConfiguration.clusterInstaller,
            this.promiseFactory,
            nodesUnderTest,
            this.versioning,
            clusterConfiguration,
            this.serviceDiscoverer,
            this,
            this.newClusterInstaller(),
            this.esxi
        );
    }
    
    newClusterInstaller() {
        return new ClusterInstaller(
            this.promiseFactory,
            this.clusterTestingConfiguration.clusterInstaller
        );
    }

    newNodeUnderTest(nodeConfiguration:INodeConfiguration):INodeUnderTest {
        return new NodeUnderTest(
            nodeConfiguration,
            this.sshClient,
            this.promiseFactory,
            this.mcs,
            this.openTSDB,
            this.installer,
            this.elasticSearch,
            this.versioning,
            this.packaging,
            this.testing.defaultReleasePhase,
            this.collections,
            this.operatingSystems
        );
    }

    newESXIManagedCluster(clusterConfiguration:IClusterConfiguration):ESXIManagedCluster {
        return new ESXIManagedCluster(
            clusterConfiguration,
            this.esxi,
            this.promiseFactory
        );
    }

    newClusterTestResult(cucumberTestResult:ICucumberTestResult,
                         frameworkConfiguration:IFrameworkConfiguration,
                         versionGraph:IClusterVersionGraph,
                         clusterConfiguration:IClusterConfiguration,
                         logs:IList<INodeLog>,
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