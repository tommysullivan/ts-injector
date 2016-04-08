import IJSONObject from "../typed-json/i-json-object";

export default class OpenTSDBConfig {
    private openTSDBConfigJSON:IJSONObject;

    constructor(openTSDBConfigJSON:IJSONObject) {
        this.openTSDBConfigJSON = openTSDBConfigJSON;
    }

    get openTSDBQueryPathTemplate():string {
        return this.openTSDBConfigJSON.getProperty<string>('openTSDBQueryPathTemplate');
    }

    get openTSDBUrlTemplate():string {
        return this.openTSDBConfigJSON.getProperty<string>('openTSDBUrlTemplate');
    }
}