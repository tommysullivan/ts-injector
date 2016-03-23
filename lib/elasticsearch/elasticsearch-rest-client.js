module.exports = function(api, elasticSearchHostAndOptionalPort) {
    return {
        getLogsForIndex: function(indexName) {
            var restClient = api.newRestClientAsPromised(elasticSearchHostAndOptionalPort);
            return restClient.get('/'+indexName)
                .then(successfulResult=>successfulResult.jsonBody());
        }
    }
}