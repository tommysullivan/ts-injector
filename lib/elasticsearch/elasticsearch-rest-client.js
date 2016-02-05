module.exports = function(api, elasticSearchHostAndOptionalPort) {
    return {
        getLogsForIndex: function(indexName) {
            return api.newPromise(function(resolve, reject) {
                api.newRestClientAsPromised(elasticSearchHostAndOptionalPort).get('/'+indexName).done(
                    function(successfulResult) {
                        resolve(JSON.parse(successfulResult.body));
                    },
                    reject
                );
            });
        }
    }
}