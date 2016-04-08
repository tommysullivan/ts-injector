import IList from "../collections/i-list";
import ISSHResult from "../ssh/i-ssh-result";
import INodeVersionGraph from "./i-node-version-graph";
import IClusterVersionGraph from "./i-cluster-version-graph";
import IServiceConfig from "./i-service-config";
import IJSONObject from "../typed-json/i-json-object";

interface IVersioning {
    newNodeVersionGraph(host:string, shellCommandResultSet:IList<ISSHResult>):INodeVersionGraph;
    newClusterVersionGraph(clusterId:string, nodeVersionGraphs:IList<INodeVersionGraph>):IClusterVersionGraph;
    newServiceConfiguration(serviceConfigurationJSON:IJSONObject):IServiceConfig;
    serviceSet():IList<IServiceConfig>;
}

export default IVersioning;