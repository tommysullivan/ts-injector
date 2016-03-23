module.exports = function(api, authedRestClient, installerConfigUrl, installerServicesURL, processURL) {
    return {
        configuration: function() {
            return authedRestClient.get(installerConfigUrl)
                .then(response => api.newInstallerConfiguration(
                    response.jsonBody(),
                    authedRestClient,
                    installerConfigUrl
                ));
        },
        services: function() {
            return authedRestClient.get(installerServicesURL)
                .then(response => api.newInstallerServices(response.jsonBody()));
        },
        process: function() {
            return authedRestClient.get(processURL)
                .then(response=> api.newInstallerProcess(
                    response.jsonBody(),
                    authedRestClient,
                    processURL
                ));
        }
    }
}