import IThenable from "../promise/i-thenable";
import Rest from "../rest/rest";
import ElasticSearchResult from "./elasticsearch-result";

export default class ElasticSearchRestClient {
    private rest:Rest;
    private elasticSearchHostAndOptionalPort:string;

    constructor(rest:Rest, elasticSearchHostAndOptionalPort:string) {
        this.rest = rest;
        this.elasticSearchHostAndOptionalPort = elasticSearchHostAndOptionalPort;
    }

    logsForServiceThatContainText(serviceName:string, soughtText:string):IThenable<ElasticSearchResult> {
        var queryJSON = {
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

    executeQuery(queryJSON:any):IThenable<ElasticSearchResult> {
        var restClient = this.rest.newRestClientAsPromised(this.elasticSearchHostAndOptionalPort);
        var options = {
            body: JSON.stringify(queryJSON),
        };
        return restClient.post(`/_search`, options)
            .then(result=>new ElasticSearchResult(result.bodyAsJsonObject()));
    }

    logsForService(serviceName:string):IThenable<ElasticSearchResult> {
        var queryJSON = {
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