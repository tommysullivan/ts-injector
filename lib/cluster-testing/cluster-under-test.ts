import IClusterUnderTest from "./i-cluster-under-test";
import ClusterInstallerConfig from "./cluster-installer-config";
import IThenable from "../promise/i-thenable";
import MCSRestSession from "../mcs/mcs-rest-session";
import IInstallerRestSession from "../installer/i-installer-rest-session";
import OpenTSDBRestClient from "../open-tsdb/open-tsdb-rest-client";
import ElasticSearchRestClient from "../elasticsearch/elasticsearch-rest-client";
import IList from "../collections/i-list";
import IESXIResponse from "../esxi/i-esxi-response";
import ISSHResult from "../ssh/i-ssh-result";
import IClusterVersionGraph from "../versioning/i-cluster-version-graph";
import IPromiseFactory from "../promise/i-promise-factory";
import INode from "./i-node";
import IVersioning from "../versioning/i-versioning";
import IClusterConfiguration from "../clusters/i-cluster-configuration";
import ServiceDiscoverer from "./service-discoverer";
import ClusterTesting from "./cluster-testing";
import ClusterInstaller from "./cluster-installer";

export default class ClusterUnderTest implements IClusterUnderTest {
    private clusterInstallerConfiguration:ClusterInstallerConfig;
    private promiseFactory:IPromiseFactory;
    private clusterNodes:IList<INode>;
    private versioning:IVersioning;
    private clusterConfig:IClusterConfiguration;
    private serviceDiscoverer:ServiceDiscoverer;
    private clusterTesting:ClusterTesting;
    private clusterInstaller:ClusterInstaller;

    constructor(clusterInstallerConfiguration:ClusterInstallerConfig, promiseFactory:IPromiseFactory, clusterNodes:IList<INode>, versioning:IVersioning, clusterConfig:IClusterConfiguration, serviceDiscoverer:ServiceDiscoverer, clusterTesting:ClusterTesting, clusterInstaller:ClusterInstaller) {
        this.clusterInstallerConfiguration = clusterInstallerConfiguration;
        this.promiseFactory = promiseFactory;
        this.clusterNodes = clusterNodes;
        this.versioning = versioning;
        this.clusterConfig = clusterConfig;
        this.serviceDiscoverer = serviceDiscoverer;
        this.clusterTesting = clusterTesting;
        this.clusterInstaller = clusterInstaller;
    }

    get installationTimeoutInMilliseconds():number {
        return this.clusterInstallerConfiguration.installationTimeoutInMilliseconds;
    }

    nodeWithHostName(hostName:string):INode {
        return this.nodes().firstWhere(n=>n.host==hostName);
    }

    newAuthedMCSSession():IThenable<MCSRestSession> {
        return this.serviceDiscoverer.nodeHostingServiceViaDiscover(this, 'mapr-webserver')
            .then(node=>node.newAuthedMCSSession());
    }

    newAuthedInstallerSession():IThenable<IInstallerRestSession> {
        return this.serviceDiscoverer.nodeHostingServiceViaDiscover(this, 'mapr-installer')
            .then(node=>node.newAuthedInstallerSession());
    }
    
    newOpenTSDBRestClient():IThenable<OpenTSDBRestClient> {
        return this.serviceDiscoverer.nodeHostingServiceViaDiscover(this, 'mapr-opentsdb')
            .then(node=>node.newOpenTSDBRestClient());
    }
    
    newElasticSearchClient():IThenable<ElasticSearchRestClient> {
        return this.serviceDiscoverer.nodeHostingServiceViaDiscover(this, 'mapr-elasticsearch')
            .then(node=>node.newElasticSearchClient());
    }
    
    isManagedByESXI():boolean {
        return this.clusterConfig.esxiServerConfiguration != null;
    }
    
    get name():string {
        return this.clusterConfig.name;
    }

    powerOff():IThenable<IESXIResponse> {
        return this.clusterTesting.esxiManagedClusterForId(this.clusterConfig.id).powerOff();
    }

    revertToState(stateName:string):IThenable<IESXIResponse> {
        return this.clusterTesting.esxiManagedClusterForId(this.clusterConfig.id).revertToState(stateName);
    }

    deleteSnapshotsWithStateName(stateName:string):IThenable<IESXIResponse> {
        return this.clusterTesting.esxiManagedClusterForId(this.clusterConfig.id).deleteSnapshotsWithStateName(stateName);
    }

    snapshotInfo():IThenable<IESXIResponse> {
        return this.clusterTesting.esxiManagedClusterForId(this.clusterConfig.id).snapshotInfo();
    }

    captureSnapshotNamed(stateName:string):IThenable<IESXIResponse> {
        return this.clusterTesting.esxiManagedClusterForId(this.clusterConfig.id).captureSnapshotNamed(stateName);
    }

    //TODO: Depend directly on clusterInstaller and then construct that with instance of this class
    verifyMapRNotInstalled():IThenable<IList<ISSHResult>> {
        return this.clusterInstaller.verifyMapRNotInstalled(this);
    }

    executeShellCommandOnEachNode(command:string):IThenable<IList<ISSHResult>> {
        return this.promiseFactory.newGroupPromise(
            this.clusterNodes.map(n=>n.executeShellCommand(command))
        );
    }

    executeShellCommandsOnEachNode(commands:IList<string>):IThenable<IList<IList<ISSHResult>>> {
        return this.promiseFactory.newGroupPromise(
            this.clusterNodes.map(n=>n.executeShellCommands(commands))
        );
    }

    versionGraph():IThenable<IClusterVersionGraph> {
        return this.promiseFactory.newGroupPromise(this.clusterNodes.map(n=>n.versionGraph()))
            .then(versionGraphs=>{
                return this.versioning.newClusterVersionGraph(
                    this.clusterConfig.id,
                    versionGraphs
                );
            });
    }

    nodes():IList<INode> {
        return this.clusterNodes.clone();
    }

    nodesHosting(serviceName:string):IList<INode> {
        return this.clusterNodes.filter(n=>n.isHostingService(serviceName));
    }

    nodeHosting(serviceName:string):INode {
        return this.nodesHosting(serviceName).first();
    }

    uploadToEachNode(localPath:string, remotePath:string):IThenable<IList<ISSHResult>> {
        return this.promiseFactory.newGroupPromise(
            this.clusterNodes.map(n=>n.upload(localPath, remotePath))
        );
    }
}