import IList from "../../collections/i-list";
import IESXIServerConfiguration from "./i-esxi-server-configuration";
import IJSONObject from "../../typed-json/i-json-object";
import ESXIServerConfiguration from "./esxi-server-configuration";

export default class ESXIConfiguration {
    private configJSON:IJSONObject;

    constructor(configJSON:IJSONObject) {
        this.configJSON = configJSON;
    }

    get servers():IList<IESXIServerConfiguration> {
        return this.configJSON.listOfJSONObjectsNamed('servers').map(c=>new ESXIServerConfiguration(c));
    }
}