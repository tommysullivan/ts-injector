module.exports = function(api, openTSDBHostAndPort, openTSDBQueryPathTemplate) {
    return {
        queryForMetric: function(startTime, metricName) {
            var restClientAsPromised = api.newRestClientAsPromised(openTSDBHostAndPort);
            var openTSDBQueryPath = openTSDBQueryPathTemplate.replace('{start}', startTime);
            openTSDBQueryPath = openTSDBQueryPath.replace('{metricName}', metricName);
            return restClientAsPromised.get(openTSDBQueryPath)
                .then(response=>response.jsonBody());
        }
    }
}