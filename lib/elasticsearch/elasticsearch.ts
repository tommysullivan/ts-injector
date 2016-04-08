import ElasticSearchRestClient from "./elasticsearch-rest-client";
import Rest from "../rest/rest";
import ElasticSearchConfiguration from "./elasticsearch-configuration";

export default class ElasticSearch {
    private rest:Rest;
    private config:ElasticSearchConfiguration;

    constructor(rest:Rest, config:ElasticSearchConfiguration) {
        this.rest = rest;
        this.config = config;
    }

    newElasticSearchClient(host:string):ElasticSearchRestClient {
        var elasticSearchHostAndOptionalPort = this.config.elasticSearchURLTemplate.replace('{host}', host);
        return new ElasticSearchRestClient(this.rest, elasticSearchHostAndOptionalPort);
    }
}