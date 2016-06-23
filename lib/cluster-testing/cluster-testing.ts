import IClusterConfiguration from "../clusters/i-cluster-configuration";
import IClusterUnderTest from "./i-cluster-under-test";
import ClusterUnderTest from "./cluster-under-test";
import ClusterTestingConfiguration from "./cluster-testing-configuration";
import IPromiseFactory from "../promise/i-promise-factory";
import INodeConfiguration from "../nodes/i-node-configuration";
import INodeUnderTest from "./i-node-under-test";
import NodeUnderTest from "./node-under-test";
import ISSHClient from "../ssh/i-ssh-client";
import ICollections from "../collections/i-collections";
import MCS from "../mcs/mcs";
import OpenTSDB from "../open-tsdb/open-tsdb";
import Installer from "../installer/installer";
import ElasticSearch from "../elasticsearch/elasticsearch";
import ServiceDiscoverer from "./service-discoverer";
import ESXIManagedCluster from "./esxi-managed-cluster";
import IESXI from "../esxi/i-esxi";
import Clusters from "../clusters/clusters";
import ClusterInstaller from "./cluster-installer";
import ClusterTestResult from "./cluster-test-result";
import ICucumberRunConfiguration from "../cucumber/i-cucumber-run-configuration";
import ICucumberTestResult from "../cucumber/i-cucumber-test-result";
import FrameworkConfiguration from "../framework/framework-configuration";
import IClusterVersionGraph from "../versioning/i-cluster-version-graph";
import IVersioning from "../versioning/i-versioning";
import IPackaging from "../packaging/i-packaging";
import IReleasing from "../releasing/i-releasing";
import IPhase from "../releasing/i-phase";
import MultiClusterTester from "./multi-cluster-tester";
import IUUIDGenerator from "../uuid/i-uuid-generator";
import IFileSystem from "../node-js-wrappers/i-filesystem";
import Rest from "../rest/rest";
import IPath from "../node-js-wrappers/i-path";
import IProcess from "../node-js-wrappers/i-process";
import ICucumber from "../cucumber/i-cucumber";
import IConsole from "../node-js-wrappers/i-console";
import ResultReporter from "./result-reporter";
import ClusterLogCapturer from "./cluster-log-capturer";
import IList from "../collections/i-list";
import NodeLog from "./node-log";

export default class ClusterTesting {

    constructor(
        private clusterTestingConfiguration:ClusterTestingConfiguration,
        private promiseFactory:IPromiseFactory,
        private sshClient:ISSHClient,
        private collections:ICollections,
        private versioning:IVersioning,
        private mcs:MCS,
        private openTSDB:OpenTSDB,
        private installer:Installer,
        private elasticSearch:ElasticSearch,
        private serviceDiscoverer:ServiceDiscoverer,
        private esxi:IESXI,
        private clusters:Clusters,
        private packaging:IPackaging,
        private releasing:IReleasing,
        private uuidGenerator:IUUIDGenerator,
        private process:IProcess,
        private cucumber:ICucumber,
        private console:IConsole,
        private frameworkConfig:FrameworkConfiguration,
        private fileSystem:IFileSystem,
        private rest:Rest,
        private path:IPath
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
            this.path,
            this.clusterTestingConfiguration,
            this.clusters,
            this.process,
            this.cucumber,
            this.console,
            this.promiseFactory,
            this,
            this.newResultReporter(),
            this.newClusterLogCapturer(),
            this.collections
        )
    }

    newClusterLogCapturer():ClusterLogCapturer {
        return new ClusterLogCapturer(
            this.clusterTestingConfiguration.mcsLogFileLocation,
            this.clusterTestingConfiguration.wardenLogLocation,
            this.clusterTestingConfiguration.configureShLogLocation,
            this.clusterTestingConfiguration.mfsInitLogFileLocation,
            this.promiseFactory
        );
    }
    
    newResultReporter():ResultReporter {
        return new ResultReporter(
            this.frameworkConfig,
            this.fileSystem,
            this.rest,
            this,
            this.console,
            this.clusterTestingConfiguration,
            this.process,
            this.promiseFactory,
            this.path
        )
    }

    newClusterUnderTest(clusterConfiguration:IClusterConfiguration):IClusterUnderTest {
        return new ClusterUnderTest(
            this.clusterTestingConfiguration.clusterInstallerConfiguration,
            this.promiseFactory,
            clusterConfiguration.nodes.map(n=>this.newNodeUnderTest(n)),
            this.versioning,
            clusterConfiguration,
            this.serviceDiscoverer,
            this,
            this.newClusterInstaller(),
            this.packaging
        );
    }
    
    newClusterInstaller() {
        return new ClusterInstaller(
            this.promiseFactory,
            this.clusterTestingConfiguration.clusterInstallerConfiguration
        );
    }

    newNodeUnderTest(nodeConfiguration:INodeConfiguration):INodeUnderTest {
        return new NodeUnderTest(
            nodeConfiguration,
            this.sshClient,
            this.promiseFactory,
            this.collections,
            this.mcs,
            this.openTSDB,
            this.installer,
            this.elasticSearch,
            this.versioning,
            this.packaging,
            this.defaultReleasePhase
        );
    }

    get defaultReleasePhase():IPhase {
        return this.releasing.defaultReleases
            .releaseNamed(this.clusterTestingConfiguration.releaseUnderTest)
            .phaseNamed(this.clusterTestingConfiguration.lifecyclePhase);
    }

    newESXIManagedCluster(clusterConfiguration:IClusterConfiguration):ESXIManagedCluster {
        return new ESXIManagedCluster(
            clusterConfiguration,
            this.esxi,
            this.promiseFactory
        );
    }

    newClusterTestResult(cucumberTestResult:ICucumberTestResult, frameworkConfiguration:FrameworkConfiguration, versionGraph:IClusterVersionGraph, versionGraphError:string, clusterConfiguration:IClusterConfiguration, logs:IList<NodeLog>):ClusterTestResult {
        return new ClusterTestResult(
            cucumberTestResult,
            frameworkConfiguration,
            versionGraph,
            versionGraphError,
            clusterConfiguration,
            logs
        );
    }
}