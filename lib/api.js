var RestClientAsPromised = require('./rest/rest-client-as-promised');
var Promise = require('promise');
var CucumberRunner = require('./cucumber/cucumber-runner');
var JiraRestSession = require('./jira/jira-rest-session');
var JiraRestClient = require('./jira/jira-rest-client');
var CLIInterviewer = require('./cli/cli-interviewer');
var ConfigurationProvider = require('./cli/configuration-provider');
var CLIApplication = require('./cli/cli-application');
var SpyglassInstaller = require('./installer/spyglass-installer');
var MCSRestClient = require('./mcs/mcs-rest-client');
var MCSRestSession = require('./mcs/mcs-rest-session');
var MCSDashboardInfo = require('./mcs/mcs-dashboard-info');

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
                agentOptions: {
                    rejectUnauthorized: false
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
        },
        newSpyglassInstaller: function() {
            return SpyglassInstaller(this);
        },
        newCucumberRunner: function() {
            return CucumberRunner(
                this,
                configJSON["cucumberCLITemplate"]
            );
        },
        newJiraRestSession: function(authedRestClient) {
            return JiraRestSession(
                this,
                authedRestClient,
                configJSON['jiraIssueSearchPath']
            );
        },
        newMCSRestClient: function(mcsProtocolHostAndOptionalPort) {
            return MCSRestClient(this, mcsProtocolHostAndOptionalPort, configJSON['mcsLoginPath']);
        },
        newMCSRestSession: function(authedRestClient) {
            return MCSRestSession(this, authedRestClient, configJSON['mcsDashboardInfoPath']);
        },
        newMCSDashboardInfo: function(dashboardInfoJSONObject) {
            return MCSDashboardInfo(dashboardInfoJSONObject, configJSON['spyglassServicesNamesInMCSDashboardInfo']);
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
        }
    }
}