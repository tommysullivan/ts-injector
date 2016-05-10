import INodeConfiguration from "./i-node-configuration";
import IList from "../collections/i-list";
import ESXINodeConfiguration from "../esxi/configuration/esxi-node-configuration";
import IOperatingSystemConfig from "./../operating-systems/i-operating-system-config";
import OperatingSystemConfig from "./../operating-systems/operating-system-config";
import IJSONObject from "../typed-json/i-json-object";
import IESXINodeConfiguration from "../esxi/configuration/i-esxi-node-configuration";
import ICollections from "../collections/i-collections";

export default class NodeConfiguration implements INodeConfiguration {
    private nodeJSON:IJSONObject;
    private collections:ICollections;

    constructor(nodeJSON:IJSONObject, collections:ICollections) {
        this.nodeJSON = nodeJSON;
        this.collections = collections;
    }

    snapshotIdFromStateName(stateName:string):number {
        return this.esxiNodeConfiguration.states
            .firstWhere(s=>s.name==stateName).snapshotId;
    }

    get host():string { return this.nodeJSON.stringPropertyNamed('host'); }
    get username():string {return this.nodeJSON.stringPropertyNamed('username'); }
    get password():string {return this.nodeJSON.stringPropertyNamed('password'); }
    get name():string {return this.nodeJSON.stringPropertyNamed('name'); }

    get esxiNodeConfiguration():IESXINodeConfiguration {
        return new ESXINodeConfiguration(
            this.nodeJSON.jsonObjectNamed('esxi')
        );
    }

    get operatingSystem():IOperatingSystemConfig {
        return new OperatingSystemConfig(
            this.nodeJSON.jsonObjectNamed('operatingSystem'),
            this.collections
        );
    }

    get serviceNames():IList<string> {
        return this.nodeJSON.listNamed<string>('serviceNames');
    }
    
    toJSON():string { return this.nodeJSON.toRawJSON(); }
}