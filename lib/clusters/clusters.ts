import {IClusterConfiguration} from "./i-cluster-configuration";
import {IList} from "../collections/i-list";
import {IErrors} from "../errors/i-errors";
import {IClusters} from "./i-clusters";
import {IESXI} from "../esxi/i-esxi";
import {IOperatingSystems} from "../operating-systems/i-operating-systems";
import {ICluster} from "./i-cluster";
import {ESXIManagedCluster} from "./esxi-managed-cluster";
import {INode} from "./i-node";
import {Node} from "./node";
import {IPhase} from "../releasing/i-phase";
import {INodeConfiguration} from "../nodes/i-node-configuration";
import {IClusterLogCapturer} from "./i-cluster-log-capturer";
import {ClusterLogCapturer} from "./cluster-log-capturer";
import {INodeLog} from "./i-node-log";
import {NodeLog} from "./node-log";
import {ICollections} from "../collections/i-collections";
import {IFileSystem} from "../node-js-wrappers/i-filesystem";
import {Cluster} from "./cluster";
import {IVersioning} from "../versioning/i-versioning";
import {ISSHClient} from "../ssh/i-ssh-client";
import {IMCS} from "../mcs/i-mcs";
import {IOpenTSDB} from "../open-tsdb/i-open-tsdb";
import {IInstaller} from "../installer/i-installer";
import {IElasticsearch} from "../elasticsearch/i-elasticsearch";
import {IServiceDiscoverer} from "./i-service-discoverer";
import {IPackaging} from "../packaging/i-packaging";
import {IServiceGroupConfig} from "../services/i-service-group-config";
import {ClusterInstaller} from "../installer/cluster-installer";
import {IClusterInstaller} from "../installer/i-cluster-installer";
import {IFutures} from "../futures/i-futures";

export class Clusters implements IClusters {
    constructor(
        private clusterConfigurations:IList<IClusterConfiguration>,
        private errors:IErrors,
        private collections:ICollections,
        private sshClient:ISSHClient,
        private versioning:IVersioning,
        private mcs:IMCS,
        private openTSDB:IOpenTSDB,
        private installer:IInstaller,
        private elasticSearch:IElasticsearch,
        private serviceDiscoverer:IServiceDiscoverer,
        private esxi:IESXI,
        private packaging:IPackaging,
        private operatingSystems:IOperatingSystems,
        private fileSystem:IFileSystem,
        private serviceGroups:IList<IServiceGroupConfig>,
        private futures:IFutures
    ) {}

    clusterConfigurationWithId(id:string):IClusterConfiguration {
        try {
            return this.allConfigurations.firstWhere(c=>c.id==id);
        }
        catch(e) {
            throw this.errors.newErrorWithCause(e, `Failed to find configuration with id "${id}"`);
        }
    }

    get allIds():IList<string> {
        return this.allConfigurations.map(c=>c.id);
    }

    get allConfigurations():IList<IClusterConfiguration> {
        return this.clusterConfigurations;
    }

    clusterForId(clusterId:string):ICluster {
        return this.newCluster(
            this.clusterConfigurationWithId(clusterId)
        );
    }

    esxiManagedClusterForId(clusterId:string):ESXIManagedCluster {
        return this.newESXIManagedCluster(
            this.clusterConfigurationWithId(clusterId)
        );
    }

    newClusterLogCapturer():IClusterLogCapturer {
        return new ClusterLogCapturer(
            this.collections,
            this.fileSystem,
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

    newCluster(clusterConfiguration:IClusterConfiguration, releasePhase?:IPhase):ICluster {
        const nodesUnderTest = this.collections.newList(
            clusterConfiguration.nodes.map(n=>this.newNode(n, releasePhase))
        );
        return new Cluster(
            nodesUnderTest,
            this.versioning,
            clusterConfiguration,
            this.serviceDiscoverer,
            this,
            this.newClusterInstaller(),
            this.esxi
        );
    }

    newClusterInstaller():IClusterInstaller {
        return new ClusterInstaller();
    }

    newNode(nodeConfiguration:INodeConfiguration, releasePhase:IPhase):INode {
        return new Node(
            nodeConfiguration,
            this.sshClient,
            this.futures,
            this.mcs,
            this.openTSDB,
            this.installer,
            this.elasticSearch,
            this.versioning,
            this.packaging,
            releasePhase,
            this.collections,
            this.operatingSystems,
            this.serviceGroups
        );
    }

    newESXIManagedCluster(clusterConfiguration:IClusterConfiguration):ESXIManagedCluster {
        return new ESXIManagedCluster(
            clusterConfiguration,
            this.esxi,
            this.futures
        );
    }
}