import {IJSONObject} from "../typed-json/i-json-object";
import {IRestConfiguration} from "./i-rest-configuration";

export class RestConfiguration implements IRestConfiguration {
    private restConfigJSON:IJSONObject;

    constructor(restConfigJSON:IJSONObject) {
        this.restConfigJSON = restConfigJSON;
    }

    get debugHTTP():boolean {
        return this.restConfigJSON.booleanPropertyNamed('debugHTTP');
    }
}