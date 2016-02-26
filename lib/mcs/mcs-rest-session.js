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
                        var dataElement = JSON.parse(response.body).data;
                        if(dataElement == null || dataElement.length<1) reject('mcs link json did not include data element');
                        else {
                            var url = dataElement[0].url;
                            if(url==null) reject("URL not found");
                            else resolve(url);
                        }
                    },
                    reject
                )
            });
        }
    }
}