module.exports = function(api, grafanaHostAndOptionalPort, grafanaLoginPath) {
    return {
        createAutheticatedSession: function(username, password) {
            return api.newPromise(function(resolve, reject) {
                var restClientAsPromised = api.newRestClientAsPromised(grafanaHostAndOptionalPort);
                restClientAsPromised.post(
                    grafanaLoginPath,
                    {
                        body: {
                            user: username,
                            email: '',
                            password: password
                        },
                        json: true
                    }
                ).done(
                    function(ignoredResponseWhoseSessionCookieResidesInRestClientAsPromised) {
                        var authedRestClient = restClientAsPromised;
                        resolve(api.newGrafanaRestSession(authedRestClient));
                    },
                    reject
                );
            });
        }
    }
}