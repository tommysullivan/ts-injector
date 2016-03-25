module.exports = function(api, testPortalHostAndPort) {
    return {
        syncMultiClusterTestResultToServer: function(multiClusterTest) {
            var clusterTestResults = multiClusterTest.clusterTestResults();
            var restClient = api.newRestClientAsPromised(testPortalHostAndPort);
            return api.newGroupPromise(clusterTestResults.map(clusterResult=>{
                var path = `/${clusterResult.jsonResultFilePath()}`;
                var putArgs = {
                    body: clusterResult.toJSON(),
                    json: true
                }
                return restClient.put(path, putArgs);
            }));
        }
    }
}