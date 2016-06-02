import INodeConfiguration from "./i-node-configuration";
import IList from "../collections/i-list";
import ESXINodeConfiguration from "../esxi/configuration/esxi-node-configuration";
import IOperatingSystem from "./../operating-systems/i-operating-system";
import IJSONObject from "../typed-json/i-json-object";
import IESXINodeConfiguration from "../esxi/configuration/i-esxi-node-configuration";
import IOperatingSystems from "../operating-systems/i-operating-systems";

export default class NodeConfiguration implements INodeConfiguration {
    private nodeJSON:IJSONObject;
    private operatingSystems:IOperatingSystems;

    constructor(nodeJSON:IJSONObject, operatingSystems:IOperatingSystems) {
        this.nodeJSON = nodeJSON;
        this.operatingSystems = operatingSystems;
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

    get operatingSystem():IOperatingSystem {
        return this.operatingSystems.newOperatingSystemFromConfig(this.nodeJSON.jsonObjectNamed('operatingSystem'));
    }

    get serviceNames():IList<string> {
        return this.nodeJSON.listNamed<string>('serviceNames');
    }
    
    toJSON():string { return this.nodeJSON.toRawJSON(); }
}