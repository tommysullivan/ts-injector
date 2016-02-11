var RestClientAsPromised = require('./rest/rest-client-as-promised');
var Promise = require('promise');
var CucumberRunner = require('./cucumber/cucumber-runner');
var JiraRestSession = require('./jira/jira-rest-session');
var JiraRestClient = require('./jira/jira-rest-client');
var CLIInterviewer = require('./cli/cli-interviewer');
var ConfigurationProvider = require('./cli/configuration-provider');
var CLIApplication = require('./cli/cli-application');
var MCSRestClient = require('./mcs/mcs-rest-client');
var MCSRestSession = require('./mcs/mcs-rest-session');
var MCSDashboardInfo = require('./mcs/mcs-dashboard-info');
var GrafanaRestClient = require('./grafana/grafana-rest-client');
var GrafanaRestSession = require('./grafana/grafana-rest-session');
var OpenTSDBRestClient = require('./open-tsdb/open-tsdb-rest-client');
var ElasticSearchRestClient = require('./elasticsearch/elasticsearch-rest-client');
var TestPortalWebServer = require('./test-portal/test-portal-web-server');

var request = require('request');
var prompt = require('prompt');
var optimist = require('optimist');
var urlValidator = require('valid-url');
var http = require('http');
var path = require('path');
var express;// = require('express');

module.exports = function(configJSON) {
    request.debug = configJSON['debugHTTP'];
    return {
        newTestPortalWebServer: function() {
            return TestPortalWebServer(this, express, path, http);
        },
        newElasticSearchRestClient: function(elasticSearchHostAndOptionalPort) {
            return ElasticSearchRestClient(this, elasticSearchHostAndOptionalPort);
        },
        newCLIApplication: function() {
            return CLIApplication(this, configJSON);
        },
        newGrafanaRestClient: function(grafanaHostAndOptionalPort) {
            return GrafanaRestClient(
                this,
                grafanaHostAndOptionalPort,
                configJSON['grafanaLoginPath']
            );
        },
        newGrafanaRestSession: function(authedRestClient) {
            return GrafanaRestSession(
                this,
                authedRestClient,
                configJSON['grafanaDashboardImportPath']
            );
        },
        newOpenTSDBRestClient: function(openTSDBHostAndPort) {
            return OpenTSDBRestClient(
                this,
                openTSDBHostAndPort,
                configJSON['openTSDBQueryPathTemplate']
            );
        },
        newRestClientAsPromised: function(baseURL) {
            return RestClientAsPromised(this, this.newJSONRequestorWithCookies(baseURL));
        },
        newURLValidator: function() {
            return urlValidator;
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
            return MCSRestSession(
                this,
                authedRestClient,
                configJSON['mcsDashboardInfoPath'],
                configJSON['mcsApplicationLinkPathTemplate']
            );
        },
        newMCSDashboardInfo: function(dashboardInfoJSONObject) {
            return MCSDashboardInfo(
                dashboardInfoJSONObject,
                configJSON['spyglassServicesNamesInMCSDashboardInfo']
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
        newGroupPromise: function(promises) {
            return Promise.all(promises);
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