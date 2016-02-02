module.exports = function(api, authedRestClient) {
    return {
        getNodeList: function() {

            //http://10.10.88.96:8443/api/node/list
            //authedRestClient.
            //return
        },
        dashboardInfo: function() {
            return api.newPromise(function(resolve, reject) {
                authedRestClient.post('api/dashboard/info').done(
                    function(response) {
                        var dashboardInfo = api.newMCSDashboardInfo(JSON.parse(response.body));
                        resolve(dashboardInfo);
                    },
                    reject
                )
            });
        }
    }
}