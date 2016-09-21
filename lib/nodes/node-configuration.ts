import {INodeConfiguration} from "./i-node-configuration";
import {ESXINodeConfiguration} from "../esxi/configuration/esxi-node-configuration";
import {IJSONObject} from "../typed-json/i-json-object";
import {IESXINodeConfiguration} from "../esxi/configuration/i-esxi-node-configuration";
import {IOperatingSystems} from "../operating-systems/i-operating-systems";
import {OperatingSystemConfig} from "../operating-systems/operating-system-config";
import {IOperatingSystemConfig} from "../operating-systems/i-operating-system-config";

export class NodeConfiguration implements INodeConfiguration {
    constructor(
        private nodeJSON:IJSONObject,
        private operatingSystems:IOperatingSystems
    ) {}

    get host():string { return this.nodeJSON.stringPropertyNamed('host'); }
    get username():string {return this.nodeJSON.stringPropertyNamed('username'); }
    get password():string {return this.nodeJSON.stringPropertyNamed('password'); }
    get name():string {return this.nodeJSON.stringPropertyNamed('name'); }

    get esxi():IESXINodeConfiguration {
        return new ESXINodeConfiguration(
            this.nodeJSON.jsonObjectNamed('esxi')
        );
    }

    get operatingSystem():IOperatingSystemConfig {
        return new OperatingSystemConfig(
            this.nodeJSON.jsonObjectNamed('operatingSystem')
        );
    }

    get serviceNames():Array<string> {
        return this.nodeJSON.listNamed<string>('serviceNames').toArray();
    }
    
    toJSON():string { return this.nodeJSON.toJSON(); }
}