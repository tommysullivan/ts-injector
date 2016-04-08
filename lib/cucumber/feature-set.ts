import IList from "../collections/i-list";
import IJSONObject from "../typed-json/i-json-object";

export default class FeatureSet {
    private configJSON:IJSONObject;

    constructor(configJSON:IJSONObject) {
        this.configJSON = configJSON;
    }

    get id():string {
        return this.configJSON.stringPropertyNamed('id');
    }

    get featureFilesInExecutionOrder():IList<string> {
        return this.configJSON.listNamed<string>('featureFilePaths');
    }

    toJSON():any { return this.configJSON.toRawJSON(); }
    toString():any { return this.configJSON.toString(); }
}