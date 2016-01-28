module.exports = function(api, jiraProtocolHostAndOptionalPort, jiraRestSessionPath) {
    return {
        authenticate: function(username, password) {
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
                    function(response) {
                        if(response.statusCode == 401) reject('Authorization failed - ' + response.statusCode);
                        else resolve(api.newJiraRestSession(restClientAsPromised));
                    },
                    reject
                );
            });
        }
    }
}