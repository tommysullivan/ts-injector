import {IESXINodeConfiguration} from "./i-esxi-node-configuration";
import {ISnapshotConfiguration} from "./i-snapshot-configuration";
import {SnapshotConfiguration} from "./snapshot-configuration";
import {IJSONObject} from "../../typed-json/i-json-object";

export class ESXINodeConfiguration implements IESXINodeConfiguration {
    private configJSON:IJSONObject;

    constructor(configJSON:IJSONObject) {
        this.configJSON = configJSON;
    }

    get name():string { return this.configJSON.stringPropertyNamed('name'); }
    get id():number { return this.configJSON.numericPropertyNamed('id'); }

    get states():Array<ISnapshotConfiguration> {
        return this.configJSON.listOfJSONObjectsNamed('states').map(
            stateJSON => new SnapshotConfiguration(stateJSON)
        ).toArray();
    }
}