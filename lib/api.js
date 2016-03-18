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
var ClusterUnderTest = require('./environments/cluster-under-test');
var ESXIClient = require('./environments/vms/esxi-client');
var ESXIManagedNode = require('./environments/vms/esxi-managed-node');
var InstallerRESTClient = require('./installer/installer-rest-client');
var InstallerRESTSession = require('./installer/installer-rest-session');
var InstallerConfiguration = require('./installer/installer-configuration');
var Repositories = require('./environments/repositories');
var InstallerServices = require('./installer/installer-services');
var InstallerProcess = require('./installer/installer-process');
var SSHClient = require('./ssh/ssh-client');
var SSHSession = require('./ssh/ssh-session');
var ShellCommandResult = require('./ssh/shell-command-result');
var ShellCommandResultSet = require('./ssh/shell-command-result-set');

var nodemiral = require('nodemiral');
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
        getFlattenedClusterConfig: function(clusterId) {
            var config = _.findWhere(configJSON.testClusters, {id: clusterId});
            if(config==null) throw new Error(`Could not find config with id ${clusterId}`);
            var configCopy = JSON.parse(JSON.stringify(config));
            return configCopy.inheritsFrom ? _.extend(this.getFlattenedClusterConfig(configCopy.inheritsFrom), configCopy) : configCopy;
        },
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
                _,
                configJSON['fullyQualifiedConfigsPath'],
                configJSON['fullyQualifiedCLIInvocationsPath']
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
        newRestClientAsPromised: function(baseUrl) {
            return RestClientAsPromised(this, this.newJSONRequestorWithCookies(), baseUrl);
        },
        newURLValidator: function() {
            return urlValidator;
        },
        newInstallerRestSession: function(authedRestClient, configURL, servicesURL, processURL) {
            return InstallerRESTSession(this, authedRestClient, configURL, servicesURL, processURL);
        },
        newInstallerServices: function(servicesJSON) {
            return InstallerServices(servicesJSON, _);
        },
        newInstallerProcess: function(processJSON, authedRestClient, processURL) {
            return InstallerProcess(this, processJSON, authedRestClient, processURL, configJSON['installerPollingFrequencyMS'])
        },
        newInstallerConfiguration: function(configurationJSON, authedRestClient, installerConfigUrl) {
            return InstallerConfiguration(this, configurationJSON, authedRestClient, installerConfigUrl);
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
        getAvailableTestClusterList: function() {
            return configJSON.testClusters.map(t=>t.id).join(', ');
        },
        newClusterUnderTest: function(clusterId, repositories) {
            var clusterUnderTestConfig = this.getFlattenedClusterConfig(clusterId);
            if(clusterUnderTestConfig==null) throw new Error(`Could not find configured cluster with id: ${clusterId}`);
            var controllerConfig = clusterUnderTestConfig.controller;
            if(controllerConfig==null) throw new Error(`Cluster configuration missing controller element. Cluster Id: ${clusterId}`);
            var esxiClient = this.newESXIClient(
                controllerConfig.host,
                controllerConfig.username,
                controllerConfig.password
            );
            var clusterNodes = clusterUnderTestConfig.nodes.map(nodeConfiguration=>this.newESXIManagedNode(esxiClient, nodeConfiguration, repositories));
            return ClusterUnderTest(this, clusterUnderTestConfig, clusterNodes, _, repositories);
        },
        getAvailableRepositoryTypes: function() {
            return _.chain(configJSON.repositoryInfo.repositories).map(r=>r.phase).uniq().value().join(',');
        },
        newRepositories: function(phase) {
            return Repositories(configJSON['repositoryInfo'], phase, _);
        },
        newInstallerRESTClient: function(installerProtocolHostAndOptionalPort) {
            return InstallerRESTClient(
                this,
                installerProtocolHostAndOptionalPort,
                configJSON['installerAPIPath'],
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
        newPromiseForImmediateValue: function(value) {
            return Promise.resolve(value);
        },
        newSSHClient: function() {
            return SSHClient(this, nodemiral);
        },
        newSSHSession: function(nodemiralNativeSession) {
            return SSHSession(this, nodemiralNativeSession, _);
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
        newShellCommandResult: function(command, err, code, stdout, stderr) {
            return ShellCommandResult(command, err, code, stdout, stderr);
        },
        newShellCommandResultSet: function(allCommands, commandResults) {
            return ShellCommandResultSet(allCommands, commandResults);
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