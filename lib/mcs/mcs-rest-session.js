module.exports = function(api, authedRestClient, mcsDashboardInfoPath) {
    return {
        dashboardInfo: function() {
            return api.newPromise(function(resolve, reject) {
                authedRestClient.post(mcsDashboardInfoPath).done(
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