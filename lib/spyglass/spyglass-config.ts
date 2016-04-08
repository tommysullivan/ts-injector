import IList from "../collections/i-list";
import IJSONObject from "../typed-json/i-json-object";

export default class SpyglassConfig {
    private configJSON:IJSONObject;

    constructor(configJSON:IJSONObject) {
        this.configJSON = configJSON;
    }

    get spyglassHealthCheckServiceNames():IList<string> {
        return this.configJSON.listNamed<string>('spyglassHealthCheckServiceNames');       
    }
}