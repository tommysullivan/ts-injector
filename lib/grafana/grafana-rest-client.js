module.exports = function(api, grafanaHostAndOptionalPort, grafanaLoginPath) {
    return {
        createAutheticatedSession: function(username, password) {
            var restClientAsPromised = api.newRestClientAsPromised(grafanaHostAndOptionalPort);
            var postPayload = {
                body: {
                    user: username,
                    email: '',
                    password: password
                },
                json: true
            }
            return restClientAsPromised.post(grafanaLoginPath, postPayload)
                .then(authedRestClient=>api.newGrafanaRestSession(authedRestClient));
        }
    }
}