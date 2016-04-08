import INodeVersionGraph from "./i-node-version-graph";
import NodeVersionGraph from "./node-version-graph";
import IClusterVersionGraph from "./i-cluster-version-graph";
import IList from "../collections/i-list";
import ISSHResult from "../ssh/i-ssh-result";
import ClusterVersionGraph from "./cluster-version-graph";
import IVersioning from "./i-versioning";
import IJSONObject from "../typed-json/i-json-object";
import IServiceConfig from "./i-service-config";
import ServiceConfiguration from "./service-configuration";
import VersioningConfig from "./versioning-config";

export default class Versioning implements IVersioning {
    private versioningConfig:VersioningConfig;

    constructor(versioningConfig:VersioningConfig) {
        this.versioningConfig = versioningConfig;
    }

    newNodeVersionGraph(host:string, shellCommandResultSet:IList<ISSHResult>):INodeVersionGraph {
        return new NodeVersionGraph(host, shellCommandResultSet);
    }

    newClusterVersionGraph(clusterId:string, nodeVersionGraphs:IList<INodeVersionGraph>):IClusterVersionGraph {
        return new ClusterVersionGraph(clusterId, nodeVersionGraphs);
    }

    newServiceConfiguration(serviceConfigurationJSON:IJSONObject):IServiceConfig {
        return new ServiceConfiguration(serviceConfigurationJSON);
    }

    serviceSet():IList<IServiceConfig> {
        return this.versioningConfig.serviceSet();
    }
}