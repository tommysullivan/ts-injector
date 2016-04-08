"use strict";
var ElasticSearchRestClient = (function () {
    function ElasticSearchRestClient(rest, elasticSearchHostAndOptionalPort) {
        this.rest = rest;
        this.elasticSearchHostAndOptionalPort = elasticSearchHostAndOptionalPort;
    }
    ElasticSearchRestClient.prototype.getLogsForIndex = function (indexName) {
        var restClient = this.rest.newRestClientAsPromised(this.elasticSearchHostAndOptionalPort);
        return restClient.get('/' + indexName)
            .then(function (successfulResult) { return successfulResult.jsonBody(); });
    };
    return ElasticSearchRestClient;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ElasticSearchRestClient;
//# sourceMappingURL=elasticsearch-rest-client.js.map