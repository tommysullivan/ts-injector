import {IJSONSerializable} from "../typed-json/i-json-serializable";
import {IList} from "../collections/i-list";
import {INode} from "../clusters/i-node";
import {IJSONHash} from "../typed-json/i-json-value";

export class MesosClusterConfiguration implements IJSONSerializable {
    constructor(
      private clusterId:string,
      private mapRClusterName:string,
      private nodes:IList<INode>
    ){}

    toJSON<T>(): IJSONHash {
        return  {
            contentType : `vnd/testing.devops.lab/types/framework/MesosClusterConfiguration+json;v=1.0.0`,
            id: this.clusterId,
            name: this.mapRClusterName,
            "nodes": this.nodes.map(n => {
                return {
                    "host": n.host,
                    "operatingSystem": {
                        "name": n.operatingSystem.name,
                        "version": n.operatingSystem.version
                    },
                    "serviceNames": n.expectedServiceNames.toArray()
                };
            }).toArray()
        }
    }
}