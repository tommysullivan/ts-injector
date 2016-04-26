import IClusterConfiguration from "./i-cluster-configuration";
import IList from "../collections/i-list";
import INodeConfiguration from "./../nodes/i-node-configuration";
import IESXIServerConfiguration from "../esxi/configuration/i-esxi-server-configuration";
import IJSONObject from "../typed-json/i-json-object";
import NodeConfiguration from "./../nodes/node-configuration";
import IESXI from "../esxi/i-esxi";

export default class ClusterConfiguration implements IClusterConfiguration {
    private configJSON:IJSONObject;
    private esxi:IESXI;

    constructor(configJSON:IJSONObject, esxi:IESXI) {
        this.configJSON = configJSON;
        this.esxi = esxi;
    }

    toJSON():any {
        return this.configJSON.toRawJSON();
    }

    get id():string { return this.configJSON.stringPropertyNamed('id'); }
    get name():string { return this.configJSON.stringPropertyNamed('name'); }
    get adminPassword():string { return this.configJSON.stringPropertyNamed('adminPassword'); }

    toString():string { return this.configJSON.toString(); }

    get esxiServerConfiguration():IESXIServerConfiguration {
        return this.esxi.esxiServerConfigurationForId(
            this.configJSON.stringPropertyNamed('esxiServerId')
        );
    }

    get nodes():IList<INodeConfiguration> {
        return this.configJSON.listOfJSONObjectsNamed('nodes').map(
            nodeJSON=>new NodeConfiguration(nodeJSON)
        );
    }
}