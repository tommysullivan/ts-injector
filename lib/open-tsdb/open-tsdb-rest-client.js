"use strict";
var OpenTSDBRestClient = (function () {
    function OpenTSDBRestClient(rest, openTSDBQueryPathTemplate, openTSDBHostAndPort, openTSDB, collections) {
        this.rest = rest;
        this.openTSDBQueryPathTemplate = openTSDBQueryPathTemplate;
        this.openTSDBHostAndPort = openTSDBHostAndPort;
        this.openTSDB = openTSDB;
        this.collections = collections;
    }
    OpenTSDBRestClient.prototype.queryForMetric = function (startTime, metricName) {
        return this.queryForMetricWithTags(startTime, metricName, this.collections.newEmptyDictionary());
    };
    OpenTSDBRestClient.prototype.queryForMetricWithTags = function (startTime, metricName, soughtTags) {
        var _this = this;
        var restClientAsPromised = this.rest.newRestClientAsPromised(this.openTSDBHostAndPort);
        var openTSDBQueryPath = this.openTSDBQueryPathTemplate.replace('{start}', startTime);
        openTSDBQueryPath = openTSDBQueryPath.replace('{metricName}', metricName);
        var tagQuery = soughtTags.keys.isEmpty
            ? ''
            : this.soughtTagsAsStringQuery(soughtTags);
        var openTSDBQueryWithTags = "" + openTSDBQueryPath + tagQuery;
        console.log(openTSDBQueryWithTags);
        return restClientAsPromised.get(openTSDBQueryWithTags)
            .then(function (response) { return _this.openTSDB.newOpenTSDBResponse(soughtTags, metricName, response.jsonBody()); });
    };
    OpenTSDBRestClient.prototype.soughtTagsAsStringQuery = function (soughtTags) {
        var tagQueryParts = soughtTags.keys.map(function (k) { return (k + "=" + soughtTags.get(k).trim()); });
        return "{" + tagQueryParts.join(',') + "}";
    };
    return OpenTSDBRestClient;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = OpenTSDBRestClient;
//# sourceMappingURL=open-tsdb-rest-client.js.map