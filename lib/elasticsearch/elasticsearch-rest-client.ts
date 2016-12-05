import {IFuture} from "../futures/i-future";
import {IRest} from "../rest/i-rest";
import {IElasticsearchRestClient} from "./i-elasticsearch-rest-client";
import {IElasticsearch} from "./i-elasticsearch";
import {IElasticsearchResult} from "./i-elasticsearch-result";

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

    executeQuery(queryJSON:any):IFuture<IElasticsearchResult> {
        const restClient = this.rest.newRestClientAsPromised(this.elasticSearchHostAndOptionalPort);
        const options = {
            body: JSON.stringify(queryJSON),
        };
        console.log('elasticsearch query: ', queryJSON);
        return restClient.post(`/_search`, options)
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