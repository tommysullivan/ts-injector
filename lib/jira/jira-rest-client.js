module.exports = function(api, jiraProtocolHostAndOptionalPort, jiraRestSessionPath) {
    return {
        createAutheticatedSession: function(username, password) {
            var restClientAsPromised = api.newRestClientAsPromised(jiraProtocolHostAndOptionalPort);
            var postPayload = {
                body: {
                    username: username,
                    password: password
                },
                json: true
            }
            return restClientAsPromised.post(jiraRestSessionPath, postPayload)
                .then(()=>api.newJiraRestSession(restClientAsPromised));
        }
    }
}