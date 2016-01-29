var RestClientAsPromised = require('./rest-client-as-promised');
var Promise = require('promise');
var CucumberRunner = require('./cucumber-runner');
var JiraIssueSearcher = require('./jira-issue-searcher');
var JiraRestClient = require('./jira-rest-client');
var JiraRestSession = require('./authenticated-rest-session');
var CLIInterviewer = require('./cli-interviewer');
var ConfigurationProvider = require('./configuration-provider');
var CLIApplication = require('./cli-application');

var request = require('request');
var prompt = require('prompt');
var optimist = require('optimist');

module.exports = function(configJSON) {
    return {
        newCLIApplication: function() {
            return CLIApplication(this, configJSON);
        },
        newRestClientAsPromised: function(baseURL) {
            return RestClientAsPromised(this, this.newJSONRequestorWithCookies(baseURL));
        },
        newJSONRequestorWithCookies: function(baseURL) {
            return request.defaults({
                jar: true,
                baseUrl: baseURL,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
        },
        newCucumberRunner: function() {
            return CucumberRunner(
                this,
                configJSON["cucumberCLITemplate"]
            );
        },
        newJiraIssueSearcher: function(authenticatedRestSession) {
            return JiraIssueSearcher(
                this,
                authenticatedRestSession,
                configJSON['jiraIssueSearchPath']
            );
        },
        newConfigurationProvider: function() {
            return ConfigurationProvider(
                this,
                this.newCLIInterviewer(),
                optimist,
                configJSON['defaultJiraUsername'],
                configJSON['defaultJQLQueryKey']
            )
        },
        newCLIInterviewer: function() {
            return CLIInterviewer(
                this,
                prompt,
                configJSON['defaultJiraUsername'],
                configJSON['defaultJQLQueryKey'],
                configJSON['jiraProtocolHostAndOptionalPort'],
                Object.keys(configJSON['jqlQueries'])
            );
        },
        newPromise: function(resolve, reject) {
            return new Promise(resolve, reject);
        },
        newJiraRestClient: function() {
            return JiraRestClient(
                this,
                configJSON['jiraProtocolHostAndOptionalPort'],
                configJSON['jiraRestSessionPath']
            );
        },
        newJiraRestSession: function(authorizedRestClientAsPromised) {
            return JiraRestSession(authorizedRestClientAsPromised);
        }
    }
}