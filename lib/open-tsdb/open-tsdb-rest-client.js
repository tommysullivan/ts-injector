"use strict";
var OpenTSDBRestClient = (function () {
    function OpenTSDBRestClient(rest, openTSDBQueryPathTemplate, openTSDBHostAndPort) {
        this.rest = rest;
        this.openTSDBQueryPathTemplate = openTSDBQueryPathTemplate;
        this.openTSDBHostAndPort = openTSDBHostAndPort;
    }
    OpenTSDBRestClient.prototype.queryForMetric = function (startTime, metricName) {
        var restClientAsPromised = this.rest.newRestClientAsPromised(this.openTSDBHostAndPort);
        var openTSDBQueryPath = this.openTSDBQueryPathTemplate.replace('{start}', startTime);
        openTSDBQueryPath = openTSDBQueryPath.replace('{metricName}', metricName);
        return restClientAsPromised.get(openTSDBQueryPath)
            .then(function (response) { return response.jsonBody(); });
    };
    return OpenTSDBRestClient;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = OpenTSDBRestClient;
//# sourceMappingURL=open-tsdb-rest-client.js.map