import {IJSONObject} from "../typed-json/i-json-object";
import {IElasticsearchResult} from "./i-elasticsearch-result";

export class ElasticsearchResult implements IElasticsearchResult {
    constructor(
        private resultJSON:IJSONObject
    ) {}

    get numberOfHits():number {
        return this.resultJSON.jsonObjectNamed('hits').numericPropertyNamed('total');
    }

    toJSON():any {
        return this.resultJSON.toJSON();
    }
}