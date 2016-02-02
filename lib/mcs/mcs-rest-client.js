module.exports = function(api, mcsProtocolHostAndOptionalPort, mcsLoginPath) {
    return {
        createAutheticatedSession: function(username, password) {
            return api.newPromise(function(resolve, reject) {
                var restClientAsPromised = api.newRestClientAsPromised(mcsProtocolHostAndOptionalPort);
                restClientAsPromised.post(
                    mcsLoginPath,
                    {
                        form: {
                            username: username,
                            password: password
                        }
                    }
                ).done(
                    function(ignoredResponseWhoseSessionCookieResidesInRestClientAsPromised) {
                        var authedRestClient = restClientAsPromised;
                        resolve(api.newMCSRestSession(authedRestClient));
                    },
                    reject
                );
            });
        }
    }
}