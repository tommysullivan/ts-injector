"use strict";
var ElasticSearchResult = (function () {
    function ElasticSearchResult(resultJSON) {
        this.resultJSON = resultJSON;
    }
    Object.defineProperty(ElasticSearchResult.prototype, "numberOfHits", {
        get: function () {
            return this.resultJSON.jsonObjectNamed('hits').numericPropertyNamed('total');
        },
        enumerable: true,
        configurable: true
    });
    ElasticSearchResult.prototype.toJSON = function () {
        return this.resultJSON.toRawJSON();
    };
    return ElasticSearchResult;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ElasticSearchResult;
//# sourceMappingURL=elasticsearch-result.js.map