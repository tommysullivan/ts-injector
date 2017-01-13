import {IJSONObject} from "../typed-json/i-json-object";
import {IElasticsearchResult} from "./i-elasticsearch-result";
import {IJSONValue} from "../typed-json/i-json-value";

export class ElasticsearchResult implements IElasticsearchResult {
    constructor(
        private resultJSON:IJSONObject
    ) {}

    get numberOfHits():number {
        return this.resultJSON.jsonObjectNamed('hits').numericPropertyNamed('total');
    }

    toJSON():IJSONValue {
        return this.resultJSON.toJSON();
    }
}