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
import {IReleasing} from "../releasing/i-releasing";
import {IPhase} from "../releasing/i-phase";
import {MultiClusterTester} from "./multi-cluster-tester";
import {IUUIDGenerator} from "../uuid/i-uuid-generator";
import {IFileSystem} from "../node-js-wrappers/i-filesystem";
import {IPath} from "../node-js-wrappers/i-path";
import {IProcess} from "../node-js-wrappers/i-process";
import {ICucumber} from "../cucumber/i-cucumber";
import {IConsole} from "../node-js-wrappers/i-console";
import {MultiplexDelegateResultReporter} from "./result-reporter";
import {ClusterLogCapturer} from "./cluster-log-capturer";
import {IList} from "../collections/i-list";
import {NodeLog} from "./node-log";
import {IJSONObject} from "../typed-json/i-json-object";
import {IFrameworkConfiguration} from "../framework/i-framework-configuration";
import {ClusterResultPreparer} from "./cluster-result-preparer";
import {IResultReporter} from "./i-result-reporter";
import {FilesystemResultReporter} from "./filesystem-result-reporter";
import {PortalResultReporter} from "./portal-result-reporter";
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
import {IRest} from "../rest/i-rest";
import {IElasticsearch} from "../elasticsearch/i-elasticsearch";
import {ClusterInstaller} from "../installer/cluster-installer";
import {INodeLog} from "./i-node-log";
import {IOperatingSystems} from "../operating-systems/i-operating-systems";

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
        private releasing:IReleasing,
        private uuidGenerator:IUUIDGenerator,
        private process:IProcess,
        private cucumber:ICucumber,
        private console:IConsole,
        private frameworkConfig:IFrameworkConfiguration,
        private fileSystem:IFileSystem,
        private rest:IRest,
        private path:IPath,
        private jsonSerializer:IJSONSerializer,
        private operatingSystems:IOperatingSystems
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
            this.newClusterResultPreparer()
        )
    }

    newClusterResultPreparer():ClusterResultPreparer {
        return new ClusterResultPreparer(
            this.newClusterLogCapturer(),
            this.console,
            this.newResultReporter(),
            this.collections,
            this.clusterTestingConfiguration,
            this.fileSystem,
            this.clusters,
            this,
            this.frameworkConfig,
            this.process
        );
    }

    newClusterLogCapturer():ClusterLogCapturer {
        return new ClusterLogCapturer(
            this.clusterTestingConfiguration.mcsLogFileLocation,
            this.clusterTestingConfiguration.wardenLogLocation,
            this.clusterTestingConfiguration.configureShLogLocation,
            this.clusterTestingConfiguration.mfsInitLogFileLocation,
            this.promiseFactory,
            this
        );
    }

    newNodeLog(nodeHost:string, logContent:Array<string>, logTitle:string):INodeLog {
        return new NodeLog(
            nodeHost,
            logContent,
            logTitle
        );
    }
    
    newResultReporter():MultiplexDelegateResultReporter {
        return new MultiplexDelegateResultReporter(
            this.collections.newList([
                this.newFilesystemResultReporter(),
                this.newPortalResultReporter()
            ]),
            this.promiseFactory
        );
    }

    newFilesystemResultReporter():IResultReporter {
        return new FilesystemResultReporter(
            this.fileSystem,
            this.clusterTestingConfiguration,
            this.path,
            this.console
        );
    }

    newPortalResultReporter():IResultReporter {
        return new PortalResultReporter(
            this.rest,
            this.console,
            this.process,
            this.clusterTestingConfiguration,
            this.promiseFactory
        );
    }

    newClusterUnderTest(clusterConfiguration:IClusterConfiguration):IClusterUnderTest {
        const nodesUnderTest = this.collections.newList(
            clusterConfiguration.nodes.map(n=>this.newNodeUnderTest(n))
        );
        return new ClusterUnderTest(
            this.clusterTestingConfiguration.clusterInstallerConfiguration,
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
            this.clusterTestingConfiguration.clusterInstallerConfiguration
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
            this.defaultReleasePhase,
            this.collections,
            this.operatingSystems
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

    newClusterTestResult(cucumberTestResult:ICucumberTestResult,
                         frameworkConfiguration:IFrameworkConfiguration,
                         versionGraph:IClusterVersionGraph,
                         versionGraphError:string,
                         clusterConfiguration:IClusterConfiguration,
                         logs:IList<INodeLog>,
                         id:string,
                         testRunGUID:string,
                         packageJson:IJSONObject,
                         jenkinsURL?:string,
                         currentUser?:string,
                         gitCloneURL?:string,
                         gitSHA?:string):IClusterTestResult {
        return new ClusterTestResult(
            cucumberTestResult,
            frameworkConfiguration,
            versionGraph,
            versionGraphError,
            clusterConfiguration,
            logs,
            id,
            testRunGUID,
            packageJson,
            this.jsonSerializer,
            jenkinsURL,
            currentUser,
            gitCloneURL,
            gitSHA
        );
    }
}