import IThenable from "../promise/i-thenable";
import Rest from "../rest/rest";
import RestResponse from "../rest/rest-response";

export default class ElasticSearchRestClient {
    private rest:Rest;
    private elasticSearchHostAndOptionalPort:string;

    constructor(rest:Rest, elasticSearchHostAndOptionalPort:string) {
        this.rest = rest;
        this.elasticSearchHostAndOptionalPort = elasticSearchHostAndOptionalPort;
    }

    getLogsForIndex(indexName:string):IThenable<any> {
        var restClient = this.rest.newRestClientAsPromised(this.elasticSearchHostAndOptionalPort);
        return restClient.get('/'+indexName)
            .then(successfulResult=>successfulResult.jsonBody());
    }

    executeQuery(url:string, body:string):IThenable<RestResponse> {
        return this.rest.newRestClientAsPromised(this.elasticSearchHostAndOptionalPort).post(url, {
            body: body
        });
    }
}