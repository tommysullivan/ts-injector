import {IFuture} from "../futures/i-future";
import {IRest} from "../rest/common/i-rest";
import {IElasticsearchRestClient} from "./i-elasticsearch-rest-client";
import {IElasticsearch} from "./i-elasticsearch";
import {IElasticsearchResult} from "./i-elasticsearch-result";
import {IJSONValue} from "../typed-json/i-json-value";

export class ElasticSearchRestClient implements IElasticsearchRestClient {
    constructor(
        private rest:IRest,
        private elasticSearchHostAndOptionalPort:string,
        private elasticsearch:IElasticsearch
    ) {}

    logsForServiceThatContainText(serviceName:string, soughtText:string):IFuture<IElasticsearchResult> {
        const queryJSON = {
            "query": {
                "bool": {
                    "must": [
                        {"match": {"service_name": serviceName}},
                        {"match_phrase": {"message": soughtText }}
                    ]
                }
            }
        };
        return this.executeQuery(queryJSON);
    }

    logsForServiceThatContainTextOnParticularHost(serviceName:string, soughtText:string, hostFQDN:string):IFuture<IElasticsearchResult> {
        const queryJSON = {
            "query": {
                "bool": {
                    "must": [
                        {"match": {"service_name": serviceName}},
                        {"match": {"fqdn": hostFQDN }},
                        {"wildcard": {"message": soughtText }}
                    ]
                }
            }
        };
        return this.executeQuery(queryJSON);
    }

    executeQuery(queryJSON:IJSONValue):IFuture<IElasticsearchResult> {
        const restClient = this.rest.newRestClient(this.elasticSearchHostAndOptionalPort);
        return restClient.post(`/_search`, queryJSON)
            .then(result=>this.elasticsearch.newElasticsearchResult(result.bodyAsJsonObject));
    }

    logsForService(serviceName:string):IFuture<IElasticsearchResult> {
        const queryJSON = {
            "query": {
                "bool": {
                    "must": [
                        {"match": {"service_name": serviceName}},
                    ]
                }
            }
        };
        return this.executeQuery(queryJSON);
    }
}