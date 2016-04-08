import ISnapshotConfiguration from "./i-snapshot-configuration";
import IJSONObject from "../../typed-json/i-json-object";

export default class SnapshotConfiguration implements ISnapshotConfiguration {
    private stateJSON:IJSONObject;

    constructor(stateJSON:IJSONObject) {
        this.stateJSON = stateJSON;
    }

    get snapshotId():number { return this.stateJSON.numericPropertyNamed('snapshotId'); }
    get name():string { return this.stateJSON.stringPropertyNamed('name'); }

}