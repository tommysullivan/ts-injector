module.exports = function(api, prompt, defaultJiraUsername, defaultJQLQueryKey, jiraProtocolHostAndOptionalPort, preconfiguredJQLQueryKeys) {
    return {
        performInterview: function(argv) {
            return api.newPromise(function(resolve, reject) {
                var schema = {
                    properties: {
                        username: {
                            description: 'Enter username for JIRA located at '+jiraProtocolHostAndOptionalPort,
                            required: true,
                            default: defaultJiraUsername
                        },
                        password: {
                            description: 'Enter corresponding password',
                            required: true,
                            hidden: true
                        },
                        jql: {
                            description: "Inline JQL or one of these preconfigured keys: ("+preconfiguredJQLQueryKeys.join(",")+")",
                            required: true,
                            default: defaultJQLQueryKey
                        }
                    }
                };
                prompt.override = argv;
                prompt.start();
                prompt.get(schema, function (err, interviewAnswers) {
                    if(err) reject(err);
                    else(resolve(interviewAnswers));
                });
            });
        }
    }
}