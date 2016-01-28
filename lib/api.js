var RestClientAsPromised = require('./rest-client-as-promised');
var Promise = require('promise');
var CucumberRunner = require('./cucumber-runner');
var JiraIssueSearcher = require('./jira-issue-searcher');
var request = require('request');
var JiraRestClient = require('./jira-rest-client');
var JiraRestSession = require('./jira-rest-session');
var CLIInterviewer = require('./cli-interviewer');
var prompt = require('prompt');

module.exports = function(configJSON) {
    return {
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
        newCucumberRunner: function(jiraRestSession) {
            return CucumberRunner(this, this.newJiraIssueSearcher(jiraRestSession));
        },
        newJiraIssueSearcher: function(jiraRestSession) {
            return JiraIssueSearcher(
                this,
                jiraRestSession,
                configJSON['jiraIssueSearchPath']
            );
        },
        newCLIInterviewer: function() {
            return CLIInterviewer(
                this,
                prompt,
                configJSON['defaultJiraUsername'],
                configJSON['defaultReleaseName'],
                configJSON['jiraProtocolHostAndOptionalPort']
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