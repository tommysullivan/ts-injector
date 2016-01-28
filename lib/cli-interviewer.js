module.exports = function(api, prompt, defaultJiraUsername, defaultReleaseName, jiraProtocolHostAndOptionalPort, optimist) {
    return {
        performInterview: function() {
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
                        release: {
                            description: 'Enter the name of the release (the value of "Fix Version")',
                            required: true,
                            default: defaultReleaseName
                        }
                    }
                };

                var argv = optimist
                    .usage("Usage: run-tests-for-release [headless] [options]\nExample: run-tests-for-release -r betaRelease")
                    .alias('u', 'username')
                    .describe('u', 'JIRA username')
                    .alias('p', 'password')
                    .describe('p', 'JIRA password')
                    .alias('r', 'release')
                    .describe('r', 'JIRA release name')
                    .alias('y', 'yes')
                    .boolean('y')
                    .describe('y', 'Non-Interactive Mode')
                    .alias('h', 'help')
                    .describe('h', 'Read this documentation')
                    .argv;

                if(argv.h) optimist.showHelp();
                else if(argv.y) {
                    if(argv.password==null) {
                        optimist.showHelp();
                        reject('password is required');
                    } else {
                        var interviewAnswers = {
                            username: argv.username ? argv.username : defaultJiraUsername,
                            password: argv.password,
                            release: argv.release ? argv.release : defaultReleaseName
                        }
                        resolve(interviewAnswers);
                    }
                }
                else {
                    prompt.override = argv;
                    prompt.start();
                    prompt.get(schema, function (err, interviewAnswers) {
                        if(err) reject(err);
                        else(resolve(interviewAnswers));
                    });
                }
            });
        }
    }
}