module.exports = function(api, installerProtocolHostAndOptionalPort, installerAPIPath, installerLoginPath) {
    function apiLink(httpResponse, linkName) {
        return httpResponse.jsonBody().links[linkName];
    }
    return {
        createAutheticatedSession: function(username, password) {
            var restClientAsPromised = api.newRestClientAsPromised(installerProtocolHostAndOptionalPort);
            var loginBody = {
                form: {
                    username: username,
                    password: password
                }
            }
            return restClientAsPromised.post(installerLoginPath, loginBody)
                .then(loginResponse => restClientAsPromised.get(installerAPIPath))
                .then(apiResponse => {
                    return api.newInstallerRestSession(
                        restClientAsPromised,
                        apiLink(apiResponse, 'config'),
                        apiLink(apiResponse, 'services'),
                        apiLink(apiResponse, 'process')
                    );
                });
        }
    }
}