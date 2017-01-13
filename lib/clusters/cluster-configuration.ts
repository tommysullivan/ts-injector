import {IClusterConfiguration} from "./i-cluster-configuration";
import {INodeConfiguration} from "./../nodes/i-node-configuration";
import {IJSONObject} from "../typed-json/i-json-object";
import {NodeConfiguration} from "./../nodes/node-configuration";
import {IJSONValue} from "../typed-json/i-json-value";

export class ClusterConfiguration implements IClusterConfiguration {
    constructor(
        private configJSON:IJSONObject
    ) {}

    toJSON():IJSONValue {
        return this.configJSON.toJSON();
    }

    get id():string { return this.configJSON.stringPropertyNamed('id'); }
    get name():string { return this.configJSON.stringPropertyNamed('name'); }
    get adminPassword():string { return this.configJSON.stringPropertyNamed('adminPassword'); }

    toString():string { return this.configJSON.toString(); }

    get esxiServerId():string {
        return this.configJSON.stringPropertyNamed('esxiServerId');
    }

    get nodes():Array<INodeConfiguration> {
        return this.configJSON.listOfJSONObjectsNamed('nodes').map(
            nodeJSON=>new NodeConfiguration(nodeJSON)
        ).toArray();
    }
}