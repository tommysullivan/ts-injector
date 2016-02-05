module.exports = function(api, authedRestClient, mcsDashboardInfoPath, mcsApplicationLinkPathTemplate) {
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
        },
        applicationLinkFor: function(applicationName) {
            return api.newPromise(function(resolve, reject) {
                var applicationInfoPath = mcsApplicationLinkPathTemplate.replace('{applicationName}', applicationName);
                authedRestClient.post(applicationInfoPath).done(
                    function(response) {
                        var url = JSON.parse(response.body).data[0].url;
                        if(url==null) reject("URL not found");
                        else resolve(url);
                    },
                    reject
                )
            });
        }
    }
}