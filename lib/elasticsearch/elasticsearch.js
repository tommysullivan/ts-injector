"use strict";
var elasticsearch_rest_client_1 = require("./elasticsearch-rest-client");
var ElasticSearch = (function () {
    function ElasticSearch(rest, config) {
        this.rest = rest;
        this.config = config;
    }
    ElasticSearch.prototype.newElasticSearchClient = function (host) {
        var elasticSearchHostAndOptionalPort = this.config.elasticSearchURLTemplate.replace('{host}', host);
        return new elasticsearch_rest_client_1.default(this.rest, elasticSearchHostAndOptionalPort);
    };
    return ElasticSearch;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ElasticSearch;
//# sourceMappingURL=elasticsearch.js.map