module.exports = function(api, openTSDBHostAndPort, openTSDBQueryPathTemplate) {
    return {
        queryForMetric: function(startTime, metricName) {
            return api.newPromise(function(resolve, reject) {
                var restClientAsPromised = api.newRestClientAsPromised(openTSDBHostAndPort);
                var openTSDBQueryPath = openTSDBQueryPathTemplate.replace('{start}', startTime);
                openTSDBQueryPath = openTSDBQueryPath.replace('{metricName}', metricName);
                restClientAsPromised.get(
                    openTSDBQueryPath
                ).done(
                    function(successfulResponse) {
                        resolve(JSON.parse(successfulResponse.body));
                    },
                    reject
                );
            });
        }
    }
}