"use strict";
var ElasticSearchConfiguration = (function () {
    function ElasticSearchConfiguration(elasticSearchConfigJSON) {
        this.elasticSearchConfigJSON = elasticSearchConfigJSON;
    }
    Object.defineProperty(ElasticSearchConfiguration.prototype, "elasticSearchURLTemplate", {
        get: function () {
            return this.elasticSearchConfigJSON.getProperty('elasticSearchURLTemplate');
        },
        enumerable: true,
        configurable: true
    });
    return ElasticSearchConfiguration;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ElasticSearchConfiguration;
//# sourceMappingURL=elasticsearch-configuration.js.map