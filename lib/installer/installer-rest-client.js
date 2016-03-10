module.exports = function(api, installerProtocolHostAndOptionalPort, installerAPIPath, installerLoginPath) {
    function apiLink(httpResponse, linkName) {
        var link = JSON.parse(httpResponse.body).links[linkName];
        return link;
    }
    function loginBody(username, password) {
        return {
            form: {
                username: username,
                password: password
            }
        }
    }
    return {
        createAutheticatedSession: function(username, password) {
            return api.newPromise(function(resolve, reject) {
                var restClientAsPromised = api.newRestClientAsPromised(installerProtocolHostAndOptionalPort);
                restClientAsPromised.post(installerLoginPath, loginBody(username, password))
                    .then(loginResponse => restClientAsPromised.get(installerAPIPath))
                    .done(
                        apiResponse => resolve(api.newInstallerRestSession(
                            restClientAsPromised,
                            apiLink(apiResponse, 'config'),
                            apiLink(apiResponse, 'services'),
                            apiLink(apiResponse, 'process')
                        )),
                        reject
                    );
            });
        }
    }
}