import {ICluster} from "./i-cluster";
import {IFuture} from "../futures/i-future";
import {IInstallerRestSession} from "../installer/i-installer-rest-session";
import {IList} from "../collections/i-list";
import {IESXIResponse} from "../esxi/i-esxi-response";
import {ISSHResult} from "../ssh/i-ssh-result";
import {IClusterVersionGraph} from "../versioning/i-cluster-version-graph";
import {INode} from "./i-node";
import {IVersioning} from "../versioning/i-versioning";
import {IClusterConfiguration} from "./i-cluster-configuration";
import {IServiceDiscoverer} from "./i-service-discoverer";
import {IClusterInstaller} from "../installer/i-cluster-installer";
import {IESXIServerConfiguration} from "../esxi/configuration/i-esxi-server-configuration";
import {IESXI} from "../esxi/i-esxi";
import {IClusters} from "./i-clusters";
import {IMCSRestSession} from "../mcs/i-mcs-rest-session";
import {IElasticsearchRestClient} from "../elasticsearch/i-elasticsearch-rest-client";
import {IOpenTSDBRestClient} from "../open-tsdb/i-open-tsdb-rest-client";

export class Cluster implements ICluster {
    constructor(
        private clusterNodes:IList<INode>,
        private versioning:IVersioning,
        private clusterConfig:IClusterConfiguration,
        private serviceDiscoverer:IServiceDiscoverer,
        private clusters:IClusters,
        private clusterInstaller:IClusterInstaller,
        private esxi:IESXI
    ) {}

    get esxiServerConfiguration():IESXIServerConfiguration {
        return this.esxi.esxiServerConfigurationForId(
            this.clusterConfig.esxiServerId
        );
    }

    nodeWithHostName(hostName:string):INode {
        return this.nodes.firstWhere(n=>n.host==hostName);
    }

    newAuthedMCSSession():IFuture<IMCSRestSession> {
        return this.serviceDiscoverer.nodeHostingServiceViaDiscover(this, 'mapr-webserver')
            .then(node=>node.newAuthedMCSSession());
    }

    newAuthedInstallerSession():IFuture<IInstallerRestSession> {
        return this.serviceDiscoverer.nodeHostingServiceViaDiscover(this, 'mapr-installer')
            .then(node=>node.newAuthedInstallerSession());
    }
    
    newOpenTSDBRestClient():IFuture<IOpenTSDBRestClient> {
        return this.serviceDiscoverer.nodeHostingServiceViaDiscover(this, 'mapr-opentsdb')
            .then(node=>node.newOpenTSDBRestClient());
    }
    
    newElasticSearchClient():IFuture<IElasticsearchRestClient> {
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
        return this.clusters.esxiManagedClusterForId(this.clusterConfig.id).powerOff();
    }

    revertToState(stateName:string):IFuture<IESXIResponse> {
        return this.clusters.esxiManagedClusterForId(this.clusterConfig.id).revertToState(stateName);
    }

    deleteSnapshotsWithStateName(stateName:string):IFuture<IESXIResponse> {
        return this.clusters.esxiManagedClusterForId(this.clusterConfig.id).deleteSnapshotsWithStateName(stateName);
    }

    snapshotInfo():IFuture<IESXIResponse> {
        return this.clusters.esxiManagedClusterForId(this.clusterConfig.id).snapshotInfo();
    }

    captureSnapshotNamed(stateName:string):IFuture<IESXIResponse> {
        return this.clusters.esxiManagedClusterForId(this.clusterConfig.id).captureSnapshotNamed(stateName);
    }

    verifyMapRNotInstalled():IFuture<IList<ISSHResult>> {
        return this.clusterInstaller.verifyMapRNotInstalled(this);
    }

    executeShellCommandOnEachNode(command:string):IFuture<IList<ISSHResult>> {
        return this.clusterNodes.mapToFutureList(n=>n.executeShellCommand(command));
    }

    executeShellCommandsOnEachNode(...commands:Array<string>):IFuture<IList<IList<ISSHResult>>> {
        return this.clusterNodes.mapToFutureList(n=>n.executeShellCommands(...commands));
    }

    versionGraph():IFuture<IClusterVersionGraph> {
        return this.clusterNodes.mapToFutureList(n=>n.versionGraph())
            .then(versionGraphs=>{
                return this.versioning.newClusterVersionGraph(
                    this.clusterConfig.id,
                    versionGraphs
                );
            });
    }

    get nodes():IList<INode> {
        return this.clusterNodes.clone();
    }

    nodesHosting(serviceName:string):IList<INode> {
        return this.clusterNodes.filter(n=>n.isHostingService(serviceName));
    }
    
    isHostingService(serviceName:string):boolean {
        return this.clusterNodes.hasAtLeastOne(n=>n.isHostingService(serviceName));
    }

    nodeHosting(serviceName:string):INode {
        return this.nodesHosting(serviceName).first;
    }

    uploadToEachNode(localPath:string, remotePath:string):IFuture<IList<ISSHResult>> {
        return this.clusterNodes.mapToFutureList(n=>n.upload(localPath, remotePath));
    }

}