import {IElasticsearchResult} from "./i-elasticsearch-result";
import {IJSONObject} from "../typed-json/i-json-object";
import {IElasticsearchRestClient} from "./i-elasticsearch-rest-client";

export interface IElasticsearch {
    newElasticsearchResult(resultJSON:IJSONObject):IElasticsearchResult;
    newElasticSearchClient(host:string):IElasticsearchRestClient;
}