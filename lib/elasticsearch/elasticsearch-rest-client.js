"use strict";
var elasticsearch_result_1 = require("./elasticsearch-result");
var ElasticSearchRestClient = (function () {
    function ElasticSearchRestClient(rest, elasticSearchHostAndOptionalPort) {
        this.rest = rest;
        this.elasticSearchHostAndOptionalPort = elasticSearchHostAndOptionalPort;
    }
    ElasticSearchRestClient.prototype.logsForServiceThatContainText = function (serviceName, soughtText) {
        var queryJSON = {
            "query": {
                "bool": {
                    "must": [
                        { "match": { "service_name": serviceName } },
                        { "match_phrase": { "message": soughtText } }
                    ]
                }
            }
        };
        return this.executeQuery(queryJSON);
    };
    ElasticSearchRestClient.prototype.logsForServiceThatContainTextOnParticularHost = function (serviceName, soughtText, hostFQDN) {
        var queryJSON = {
            "query": {
                "bool": {
                    "must": [
                        { "match": { "service_name": serviceName } },
                        { "match": { "fqdn": hostFQDN } },
                        { "match_phrase": { "message": soughtText } }
                    ]
                }
            }
        };
        return this.executeQuery(queryJSON);
    };
    ElasticSearchRestClient.prototype.executeQuery = function (queryJSON) {
        var restClient = this.rest.newRestClientAsPromised(this.elasticSearchHostAndOptionalPort);
        var options = {
            body: JSON.stringify(queryJSON),
        };
        return restClient.post("/_search", options)
            .then(function (result) { return new elasticsearch_result_1.default(result.bodyAsJsonObject()); });
    };
    ElasticSearchRestClient.prototype.logsForService = function (serviceName) {
        var queryJSON = {
            "query": {
                "bool": {
                    "must": [
                        { "match": { "service_name": serviceName } },
                    ]
                }
            }
        };
        return this.executeQuery(queryJSON);
    };
    return ElasticSearchRestClient;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ElasticSearchRestClient;
//# sourceMappingURL=elasticsearch-rest-client.js.map