import {IFuture} from "../futures/i-future";
import {IElasticsearchResult} from "./i-elasticsearch-result";
import {IJSONValue} from "../typed-json/i-json-value";

export interface IElasticsearchRestClient {
    logsForServiceThatContainText(serviceName:string, soughtText:string):IFuture<IElasticsearchResult>;
    logsForServiceThatContainTextOnParticularHost(serviceName:string, soughtText:string, hostFQDN:string):IFuture<IElasticsearchResult>;
    executeQuery(queryJSON:IJSONValue):IFuture<IElasticsearchResult>;
    logsForService(serviceName:string):IFuture<IElasticsearchResult>;
}