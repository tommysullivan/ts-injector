module.exports = function(api, authedRestClient, mcsDashboardInfoPath, mcsApplicationLinkPathTemplate) {
    return {
        dashboardInfo: function() {
            return authedRestClient.post(mcsDashboardInfoPath)
                .then(response=>api.newMCSDashboardInfo(response.jsonBody()))
        },
        applicationLinkFor: function(applicationName) {
            var applicationInfoPath = mcsApplicationLinkPathTemplate.replace('{applicationName}', applicationName);
            return authedRestClient.post(applicationInfoPath)
                .then(response=>{
                    var dataElement = response.jsonBody().data;
                    if(dataElement == null || dataElement.length<1) throw new Error(`mcs link json did not include data element. json: ${response.jsonBody()}`);
                    var url = dataElement[0].url;
                    if(url==null) throw new Error(`first data element did not have url. dataElement: ${dataElement}`);
                    return url;
                });
        }
    }
}