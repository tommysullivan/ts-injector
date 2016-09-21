import {IList} from "../collections/i-list";
import {INodeVersionGraph} from "./i-node-version-graph";
import {IClusterVersionGraph} from "./i-cluster-version-graph";

export class ClusterVersionGraph implements IClusterVersionGraph {
    private clusterId:string;
    private versionGraphs:IList<INodeVersionGraph>;

    constructor(clusterId:string, versionGraphs:IList<INodeVersionGraph>) {
        this.clusterId = clusterId;
        this.versionGraphs = versionGraphs;
    }

    toString():string {
        return JSON.stringify(this.toJSON(), null, 3);
    }

    toJSON():any {
        return {
            clusterId: this.clusterId,
            nodeLevelGraphs: this.versionGraphs.map(v=>v.toJSON())
        }
    }
}