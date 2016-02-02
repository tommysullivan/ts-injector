module.exports = function(api, jiraProtocolHostAndOptionalPort, jiraRestSessionPath) {
    return {
        createAutheticatedSession: function(username, password) {
            return api.newPromise(function(resolve, reject) {
                var restClientAsPromised = api.newRestClientAsPromised(jiraProtocolHostAndOptionalPort);
                restClientAsPromised.post(
                    jiraRestSessionPath,
                    {
                        body: {
                            username: username,
                            password: password
                        },
                        json: true
                    }
                ).done(
                    function(ignoredResponseWhoseSessionCookieResidesInRestClientAsPromised) {
                        var authedRestClient = restClientAsPromised;
                        resolve(api.newJiraRestSession(authedRestClient));
                    },
                    reject
                );
            });
        }
    }
}