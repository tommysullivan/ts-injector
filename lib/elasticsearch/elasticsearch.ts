import {ElasticSearchRestClient} from "./elasticsearch-rest-client";
import {IElasticsearch} from "./i-elasticsearch";
import {IRest} from "../rest/common/i-rest";
import {IElasticsearchConfiguration} from "./i-elasticsearch-configuration";
import {IElasticsearchRestClient} from "./i-elasticsearch-rest-client";
import {ElasticsearchResult} from "./elasticsearch-result";
import {IElasticsearchResult} from "./i-elasticsearch-result";
import {IJSONObject} from "../typed-json/i-json-object";

export class ElasticSearch implements IElasticsearch {
    constructor(
        private rest:IRest,
        private config:IElasticsearchConfiguration
    ) {}

    newElasticSearchClient(host:string):IElasticsearchRestClient {
        const elasticSearchHostAndOptionalPort = this.config.elasticSearchURLTemplate.replace('{host}', host);
        return new ElasticSearchRestClient(
            this.rest,
            elasticSearchHostAndOptionalPort,
            this
        );
    }

    newElasticsearchResult(resultJSON:IJSONObject):IElasticsearchResult {
        return new ElasticsearchResult(resultJSON);
    }
}