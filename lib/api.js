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
var ESXIClient = require('./environments/esxi/esxi-client');
var ESXIManagedNode = require('./environments/esxi/esxi-managed-node');
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
var NodeUnderTest = require('./environments/node-under-test');
var RESTResponse = require('./rest/rest-response');
var ClusterVersionGraph = require('./environments/versioning/cluster-version-graph');
var NodeVersionGraph = require('./environments/versioning/node-version-graph');
var ClusterTestResult = require('./cucumber/cluster-test-result');
var MultiClusterTestResult = require('./cucumber/multi-cluster-test-result');
var TestPortalRestClient = require('./test-portal/test-portal-rest-client');

var childProcess = require('child_process');
var guid = require('guid');
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
        clusterIdForHost: function(hostName) {
            function containsHost(cluster) {
                return _.contains((cluster.nodes || []).map(h=>h.host), hostName);
            }
            var cluster = configJSON.testClusters.filter(containsHost)[0];
            return cluster ? cluster.id : null;
        },
        flattenedConfigForClusterId: function(clusterId) {
            var config = _.findWhere(configJSON.testClusters, {id: clusterId});
            if(config==null) throw new Error(`Could not find config with id ${clusterId}`);
            var configCopy = JSON.parse(JSON.stringify(config));
            return configCopy.inheritsFrom ? _.extend(this.flattenedConfigForClusterId(configCopy.inheritsFrom), configCopy) : configCopy;
        },
        newNodeUnderTest: function(nodeConfiguration, repositories) {
            return NodeUnderTest(this, nodeConfiguration, this.newSSHClient(), repositories, _);
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
        newRESTResponse: function(error, nativeResponse, originalURL) {
            return RESTResponse(error, nativeResponse, originalURL)
        },
        newClusterVersionGraph: function(clusterId, nodeVersionGraphs) {
            return ClusterVersionGraph(clusterId, nodeVersionGraphs);
        },
        newNodeVersionGraph: function(host, commandResultSet) {
            return NodeVersionGraph(host, commandResultSet);
        },
        newCucumberRunner: function() {
            return CucumberRunner(
                this,
                configJSON["cucumberCLITemplate"],
                configJSON["cucumberExecutable"],
                configJSON["nodeExecutable"],
                configJSON,
                childProcess,
                guid
            );
        },
        newClusterTestResult: function(resultJSON, stdout, stderr, processExitCode, cucumberRunConfig, versionGraph, versionGraphError) {
            return ClusterTestResult(resultJSON, stdout, stderr, processExitCode, cucumberRunConfig, versionGraph, versionGraphError);
        },
        newMultiClusterTestResult: function(testRunGUID, clusterTestResults) {
            return MultiClusterTestResult(testRunGUID, clusterTestResults, _);
        },
        newJiraRestSession: function(authedRestClient) {
            return JiraRestSession(
                this,
                authedRestClient,
                configJSON['jiraIssueSearchPath']
            );
        },
        newTestPortalRestClient: function() {
            return TestPortalRestClient(this, configJSON['testPortalHostAndPort']);
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
            var clusterUnderTestConfig = this.flattenedConfigForClusterId(clusterId);
            if(clusterUnderTestConfig==null) throw new Error(`Could not find configured cluster with id: ${clusterId}`);
            var clusterNodes = clusterUnderTestConfig.nodes.map(n=>this.newNodeUnderTest(n, repositories));
            if(clusterUnderTestConfig.type!='bare-metal') {
                var controllerConfig = clusterUnderTestConfig.controller;
                if(controllerConfig==null) throw new Error(`Cluster configuration missing controller element. Cluster Id: ${clusterId}`);
                var esxiClient = this.newESXIClient(
                    controllerConfig.host,
                    controllerConfig.username,
                    controllerConfig.password
                );
                clusterNodes = clusterNodes.map(c=>this.newESXIManagedNode(esxiClient, c.nodeConfiguration(), c));
            }
            return ClusterUnderTest(this, clusterUnderTestConfig, clusterNodes);
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
        newESXIManagedNode: function(esxiClient, nodeConfiguration, nodeUnderTest) {
            return ESXIManagedNode(this, esxiClient, nodeConfiguration, _, nodeUnderTest);
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