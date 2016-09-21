import {IESXIServerConfiguration} from "./i-esxi-server-configuration";
import {IJSONObject} from "../../typed-json/i-json-object";
import {ESXIServerConfiguration} from "./esxi-server-configuration";
import {IESXIConfiguration} from "./i-esxi-configuration";

export class ESXIConfiguration implements IESXIConfiguration {
    constructor(
        private configJSON:IJSONObject
    ) {}

    get servers():Array<IESXIServerConfiguration> {
        return this.configJSON
            .listOfJSONObjectsNamed('servers')
            .map(c=>new ESXIServerConfiguration(c))
            .toArray();
    }

    toJSON():any {
        return this.configJSON.toJSON();
    }
}