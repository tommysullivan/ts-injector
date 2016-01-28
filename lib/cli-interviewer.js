module.exports = function(api, prompt, defaultJiraUsername, defaultReleaseName, jiraProtocolHostAndOptionalPort) {
    return {
        performInterview: function() {
            return api.newPromise(function(resolve, reject) {
                var schema = {
                    properties: {
                        jiraUserName: {
                            description: 'Enter username for JIRA located at '+jiraProtocolHostAndOptionalPort,
                            required: true,
                            default: defaultJiraUsername
                        },
                        jiraPassword: {
                            description: 'Enter corresponding password',
                            required: true,
                            hidden: true
                        },
                        jiraReleaseName: {
                            description: 'Enter the name of the release (the value of "Fix Version")',
                            required: true,
                            default: defaultReleaseName
                        }
                    }
                };
                prompt.start();
                prompt.get(schema, function (err, result) {
                    if(err) reject(err);
                    else(resolve(result));
                });
            });
        }
    }
}