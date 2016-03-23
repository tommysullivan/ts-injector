module.exports = function(api, mcsProtocolHostAndOptionalPort, mcsLoginPath) {
    return {
        createAutheticatedSession: function(username, password) {
            var restClientAsPromised = api.newRestClientAsPromised(mcsProtocolHostAndOptionalPort);
            var postPayload = {
                form: {
                    username: username,
                    password: password
                }
            }
            return restClientAsPromised.post(mcsLoginPath,postPayload)
                .then(authedRestClient=>api.newMCSRestSession(authedRestClient));
        }
    }
}