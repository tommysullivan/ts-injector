module.exports = function(api, cliInterviewer, optimist, defaultJiraUsername, defaultJQLQueryKey) {
    return {
        getConfiguration: function(argv) {
            return api.newPromise(function(resolve, reject) {
                var optimistArgs = optimist
                    .usage("Usage: jql-to-cuke-tags [headless] [options]\nExample: jql-to-cuke-tags -r betaRelease")
                    .alias('u', 'username')
                    .describe('u', 'JIRA username')
                    .alias('p', 'password')
                    .describe('p', 'JIRA password')
                    .alias('j', 'jql')
                    .describe('j', 'Jira "JQL" query (can be inline JQL or name of pre-configured query in config.json)')
                    .alias('y', 'yes')
                    .boolean('y')
                    .describe('y', 'Non-Interactive Mode')
                    .alias('h', 'help')
                    .describe('h', 'Read this documentation')
                    .parse(argv);

                if(optimistArgs.h) reject(optimist.help());
                else if(optimistArgs.y) {
                    if(optimistArgs.password==null) {
                        reject(optimist.help()+"\npassword is required");
                    } else {
                        resolve({
                            username: optimistArgs.username ? optimistArgs.username : defaultJiraUsername,
                            password: optimistArgs.password,
                            jql: optimistArgs.jql ? optimistArgs.jql : defaultJQLQueryKey
                        });
                    }
                }
                else {
                    cliInterviewer.performInterview(optimistArgs).done(resolve, reject);
                }
            });
        }
    }
}