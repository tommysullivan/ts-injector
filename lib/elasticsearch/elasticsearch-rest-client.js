module.exports = function(api, elasticSearchHostAndOptionalPort) {
    return {
        getLogsForIndex: function(indexName) {
            return api.newPromise(function(resolve, reject) {
                function onSuccessfulHttpResposne(successfulResult) {
                    resolve(JSON.parse(successfulResult.body));
                }
                var restClient = api.newRestClientAsPromised(elasticSearchHostAndOptionalPort);
                var promise = restClient.get('/'+indexName);
                promise.done(onSuccessfulHttpResposne, reject);
            });
        }
    }
}