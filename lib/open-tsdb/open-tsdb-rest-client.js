"use strict";
var OpenTSDBRestClient = (function () {
    function OpenTSDBRestClient(rest, openTSDBQueryPathTemplate, openTSDBHostAndPort) {
        this.rest = rest;
        this.openTSDBQueryPathTemplate = openTSDBQueryPathTemplate;
        console.log(openTSDBQueryPathTemplate);
        this.openTSDBHostAndPort = openTSDBHostAndPort;
    }
    OpenTSDBRestClient.prototype.queryForMetric = function (startTime, metricName) {
        return this.queryForMetricWithTags(startTime, metricName, '');
    };
    OpenTSDBRestClient.prototype.queryForMetricWithTags = function (startTime, metricName, tagList) {
        var restClientAsPromised = this.rest.newRestClientAsPromised(this.openTSDBHostAndPort);
        var openTSDBQueryPath = this.openTSDBQueryPathTemplate.replace('{start}', startTime);
        openTSDBQueryPath = openTSDBQueryPath.replace('{metricName}', metricName);
        var openTSDBQueryWithTags = openTSDBQueryPath + tagList;
        console.log(openTSDBQueryWithTags);
        return restClientAsPromised.get(openTSDBQueryWithTags)
            .then(function (response) { return response.jsonBody(); });
    };
    return OpenTSDBRestClient;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = OpenTSDBRestClient;
//# sourceMappingURL=open-tsdb-rest-client.js.map