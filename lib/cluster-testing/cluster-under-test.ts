import {IClusterUnderTest} from "./i-cluster-under-test";
import {IFuture} from "../promise/i-future";
import {MCSRestSession} from "../mcs/mcs-rest-session";
import {IInstallerRestSession} from "../installer/i-installer-rest-session";
import {OpenTSDBRestClient} from "../open-tsdb/open-tsdb-rest-client";
import {ElasticSearchRestClient} from "../elasticsearch/elasticsearch-rest-client";
import {IList} from "../collections/i-list";
import {IESXIResponse} from "../esxi/i-esxi-response";
import {ISSHResult} from "../ssh/i-ssh-result";
import {IClusterVersionGraph} from "../versioning/i-cluster-version-graph";
import {IPromiseFactory} from "../promise/i-promise-factory";
import {INodeUnderTest} from "./i-node-under-test";
import {IVersioning} from "../versioning/i-versioning";
import {IClusterConfiguration} from "../clusters/i-cluster-configuration";
import {IClusterTesting} from "./i-cluster-testing";
import {IServiceDiscoverer} from "./i-service-discoverer";
import {IClusterInstaller} from "../installer/i-cluster-installer";
import {IClusterInstallerConfig} from "../installer/i-cluster-installer-config";
import {IESXIServerConfiguration} from "../esxi/configuration/i-esxi-server-configuration";
import {IESXI} from "../esxi/i-esxi";

export class ClusterUnderTest implements IClusterUnderTest {
    constructor(
        private clusterInstallerConfiguration:IClusterInstallerConfig,
        private promiseFactory:IPromiseFactory,
        private clusterNodes:IList<INodeUnderTest>,
        private versioning:IVersioning,
        private clusterConfig:IClusterConfiguration,
        private serviceDiscoverer:IServiceDiscoverer,
        private clusterTesting:IClusterTesting,
        private clusterInstaller:IClusterInstaller,
        private esxi:IESXI
    ) {}

    get esxiServerConfiguration():IESXIServerConfiguration {
        return this.esxi.esxiServerConfigurationForId(
            this.clusterConfig.esxiServerId
        );
    }

    get installationTimeoutInMilliseconds():number {
        return this.clusterInstallerConfiguration.installationTimeoutInMilliseconds;
    }

    nodeWithHostName(hostName:string):INodeUnderTest {
        return this.nodes.firstWhere(n=>n.host==hostName);
    }

    newAuthedMCSSession():IFuture<MCSRestSession> {
        return this.serviceDiscoverer.nodeHostingServiceViaDiscover(this, 'mapr-webserver')
            .then(node=>node.newAuthedMCSSession());
    }

    newAuthedInstallerSession():IFuture<IInstallerRestSession> {
        return this.serviceDiscoverer.nodeHostingServiceViaDiscover(this, 'mapr-installer')
            .then(node=>node.newAuthedInstallerSession());
    }
    
    newOpenTSDBRestClient():IFuture<OpenTSDBRestClient> {
        return this.serviceDiscoverer.nodeHostingServiceViaDiscover(this, 'mapr-opentsdb')
            .then(node=>node.newOpenTSDBRestClient());
    }
    
    newElasticSearchClient():IFuture<ElasticSearchRestClient> {
        return this.serviceDiscoverer.nodeHostingServiceViaDiscover(this, 'mapr-elasticsearch')
            .then(node=>node.newElasticSearchClient());
    }
    
    get isManagedByESXI():boolean {
        return this.clusterConfig.esxiServerId != null;
    }
    
    get name():string {
        return this.clusterConfig.name;
    }

    powerOff():IFuture<IESXIResponse> {
        return this.clusterTesting.esxiManagedClusterForId(this.clusterConfig.id).powerOff();
    }

    revertToState(stateName:string):IFuture<IESXIResponse> {
        return this.clusterTesting.esxiManagedClusterForId(this.clusterConfig.id).revertToState(stateName);
    }

    deleteSnapshotsWithStateName(stateName:string):IFuture<IESXIResponse> {
        return this.clusterTesting.esxiManagedClusterForId(this.clusterConfig.id).deleteSnapshotsWithStateName(stateName);
    }

    snapshotInfo():IFuture<IESXIResponse> {
        return this.clusterTesting.esxiManagedClusterForId(this.clusterConfig.id).snapshotInfo();
    }

    captureSnapshotNamed(stateName:string):IFuture<IESXIResponse> {
        return this.clusterTesting.esxiManagedClusterForId(this.clusterConfig.id).captureSnapshotNamed(stateName);
    }

    verifyMapRNotInstalled():IFuture<IList<ISSHResult>> {
        return this.clusterInstaller.verifyMapRNotInstalled(this);
    }

    executeShellCommandOnEachNode(command:string):IFuture<IList<ISSHResult>> {
        return this.promiseFactory.newGroupPromise(
            this.clusterNodes.map(n=>n.executeShellCommand(command))
        );
    }

    executeShellCommandsOnEachNode(...commands:Array<string>):IFuture<IList<IList<ISSHResult>>> {
        return this.promiseFactory.newGroupPromise(
            this.clusterNodes.map(n=>n.executeShellCommands(...commands))
        );
    }

    versionGraph():IFuture<IClusterVersionGraph> {
        return this.promiseFactory.newGroupPromise(this.clusterNodes.map(n=>n.versionGraph()))
            .then(versionGraphs=>{
                return this.versioning.newClusterVersionGraph(
                    this.clusterConfig.id,
                    versionGraphs
                );
            });
    }

    get nodes():IList<INodeUnderTest> {
        return this.clusterNodes.clone();
    }

    nodesHosting(serviceName:string):IList<INodeUnderTest> {
        return this.clusterNodes.filter(n=>n.isHostingService(serviceName));
    }
    
    isHostingService(serviceName:string):boolean {
        return this.clusterNodes.hasAtLeastOne(n=>n.isHostingService(serviceName));
    }

    nodeHosting(serviceName:string):INodeUnderTest {
        return this.nodesHosting(serviceName).first;
    }

    uploadToEachNode(localPath:string, remotePath:string):IFuture<IList<ISSHResult>> {
        return this.promiseFactory.newGroupPromise(
            this.clusterNodes.map(n=>n.upload(localPath, remotePath))
        );
    }

}