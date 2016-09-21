import {INodeVersionGraph} from "./i-node-version-graph";
import {NodeVersionGraph} from "./node-version-graph";
import {IClusterVersionGraph} from "./i-cluster-version-graph";
import {IList} from "../collections/i-list";
import {ISSHResult} from "../ssh/i-ssh-result";
import {ClusterVersionGraph} from "./cluster-version-graph";
import {IVersioning} from "./i-versioning";

export class Versioning implements IVersioning {
    newNodeVersionGraph(host:string, shellCommandResultSet:IList<ISSHResult>):INodeVersionGraph {
        return new NodeVersionGraph(host, shellCommandResultSet);
    }

    newClusterVersionGraph(clusterId:string, nodeVersionGraphs:IList<INodeVersionGraph>):IClusterVersionGraph {
        return new ClusterVersionGraph(clusterId, nodeVersionGraphs);
    }
}