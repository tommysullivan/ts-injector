import {IList} from "../collections/i-list";
import {ISSHResult} from "../ssh/i-ssh-result";
import {INodeVersionGraph} from "./i-node-version-graph";
import {IClusterVersionGraph} from "./i-cluster-version-graph";

export interface IVersioning {
    newNodeVersionGraph(host:string, shellCommandResultSet:IList<ISSHResult>):INodeVersionGraph;
    newClusterVersionGraph(clusterId:string, nodeVersionGraphs:IList<INodeVersionGraph>):IClusterVersionGraph;
}