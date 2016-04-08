import IJSONObject from "../typed-json/i-json-object";

export default class RestConfiguration {
    private restConfigJSON:IJSONObject;

    constructor(restConfigJSON:IJSONObject) {
        this.restConfigJSON = restConfigJSON;
    }

    get debugHTTP():boolean {
        return this.restConfigJSON.booleanPropertyNamed('debugHTTP');
    }
}