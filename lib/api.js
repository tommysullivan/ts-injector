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
var SSHClient = require('./ssh/ssh-client');
var SSHSession = require('./ssh/ssh-session');
var ClusterUnderTest = require('./environments/cluster-under-test');
var ESXIClient = require('./environments/esxi-client');
var ESXIManagedNode = require('./environments/esxi-managed-node');
var InstallerRESTClient = require('./installer/installer-rest-client');
var InstallerRESTSession = require('./installer/installer-rest-session');
var InstallerConfiguration = require('./installer/installer-configuration');
var Repositories = require('./environments/repositories');

var ssh2 = require('ssh2');
var request = require('request');
var prompt = require('prompt');
var optimist = require('optimist');
var urlValidator = require('valid-url');
var http = require('http');
var path = require('path');
var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var _ = require('underscore');

path.joinFilePath = path.join.bind(path);

module.exports = function(configJSON) {
    request.debug = configJSON['debugHTTP'];
    return {
        newTestPortalWebServer: function() {
            var testResultPath = configJSON['testResultPath'];
            var fullyQualifiedResultsPath = path.joinFilePath(__dirname,'..',testResultPath);
            return TestPortalWebServer(
                this,
                express,
                path,
                http,
                fs,
                fullyQualifiedResultsPath,
                bodyParser,
                this.newJiraRestClient(),
                configJSON['jiraUsername'],
                configJSON['jiraPassword'],
                _
            );
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
        newInstallerRestSession: function(authedRestClient) {
            return InstallerRESTSession(this, authedRestClient, configJSON['installerConfigPath']);
        },
        newInstallerConfiguration: function(configurationJSON, authedRestClient) {
            return InstallerConfiguration(this, configurationJSON, authedRestClient, configJSON['installerConfigPath']);
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
        newSSHClient: function() {
            var Client = ssh2.Client;
            var ssh2Client = new Client();
            return SSHClient(this, ssh2Client);
        },
        newSSHSession: function(connectedSSH2Client) {
            return SSHSession(this, connectedSSH2Client);
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
        newClusterUnderTest: function(clusterUnderTestId, repositories) {
            if(clusterUnderTestId==null) throw new Error([
                "Please set environment variable 'clusterUnderTestId'",
                "to the ID of one of the clusters in configuration/config.json",
                "within the 'testClusters' array.\n\n",
                "Example:\n",
                "clusterUnderTestId=tommy-cluster-1 npm test\n\n"
            ].join(' '));
            var clusterUnderTestConfig = _.findWhere(configJSON.testClusters, {id: clusterUnderTestId});
            if(clusterUnderTestConfig==null) throw new Error(`Could not find configured cluster with id: ${clusterUnderTestId}`);
            var controllerConfig = clusterUnderTestConfig.controller;
            if(controllerConfig==null) throw new Error(`Cluster configuration missing controller element. Cluster Id: ${clusterUnderTestId}`);
            var esxiClient = this.newESXIClient(
                controllerConfig.host,
                controllerConfig.username,
                controllerConfig.password
            );
            var clusterNodes = clusterUnderTestConfig.nodes.map(nodeConfiguration=>this.newESXIManagedNode(esxiClient, nodeConfiguration, repositories));
            return ClusterUnderTest(this, clusterUnderTestConfig, clusterNodes, _, repositories);
        },
        newRepositories: function(phase) {
            if(phase==null) throw new Error([
                "Please set environment variable 'phase'",
                "to the phase of product lifecycle being tested",
                "choosing from among the following phases:",
                _.chain(configJSON.repositoryInfo.repositories).map(r=>r.phase).uniq().value().join(',')
            ].join(' '));
            return Repositories(configJSON['repositoryInfo'], phase, _);
        },
        newInstallerRESTClient: function(installerProtocolHostAndOptionalPort) {
            return InstallerRESTClient(
                this,
                installerProtocolHostAndOptionalPort,
                configJSON['installerLoginPath']
            );
        },
        newESXIManagedNode: function(esxiClient, nodeConfiguration, repositories) {
            return ESXIManagedNode(this, esxiClient, nodeConfiguration, _, this.newSSHClient(), repositories);
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
        newESXIClient: function(host, username, password) {
            return ESXIClient(this, host, username, password);
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