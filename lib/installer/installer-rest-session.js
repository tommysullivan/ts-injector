module.exports = function(api, authedRestClient, installerConfigUrl, installerServicesURL, processURL) {
    return {
        configuration: function() {
            return api.newPromise((resolve, reject) => {
                authedRestClient.get(installerConfigUrl).done(
                    response => {
                        var installerConfiguration = api.newInstallerConfiguration(
                            JSON.parse(response.body),
                            authedRestClient,
                            installerConfigUrl
                        );
                        resolve(installerConfiguration)
                    },
                    reject
                );
            });
        },
        services: function() {
            return api.newPromise((resolve, reject) => {
                authedRestClient.get(installerServicesURL).done(
                    response => {
                        resolve(api.newInstallerServices(JSON.parse(response.body)));
                    },
                    reject
                );
            });
        },
        process: function() {
            return api.newPromise((resolve, reject) => {
                authedRestClient.get(processURL).done(
                    response => {
                        resolve(api.newInstallerProcess(
                            JSON.parse(response.body),
                            authedRestClient,
                            processURL
                        ));
                    },
                    reject
                );
            });
        }
    }
}