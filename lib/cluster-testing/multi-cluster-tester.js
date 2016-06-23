"use strict";
var MultiClusterTester = (function () {
    function MultiClusterTester(uuidGenerator, path, clusterTestingConfiguration, clusters, process, cucumber, console, promiseFactory, clusterTesting, resultReporter, clusterLogCapturer, collections) {
        this.uuidGenerator = uuidGenerator;
        this.path = path;
        this.clusterTestingConfiguration = clusterTestingConfiguration;
        this.clusters = clusters;
        this.process = process;
        this.cucumber = cucumber;
        this.console = console;
        this.promiseFactory = promiseFactory;
        this.clusterTesting = clusterTesting;
        this.resultReporter = resultReporter;
        this.clusterLogCapturer = clusterLogCapturer;
        this.collections = collections;
    }
    MultiClusterTester.prototype.runCucumberForEachClusterAndSaveResultsToPortalIfApplicable = function (cucumberPassThruCommands) {
        var _this = this;
        var testRunUUID = this.uuidGenerator.v4();
        var clusterTestResultPromises = this.clusterTestingConfiguration.clusterIds.map(function (clusterId) {
            var clusterConfiguration = _this.clusters.clusterConfigurationWithId(clusterId);
            var cucumberOutputPath = _this.clusterTestingConfiguration.cucumberOutputPath;
            var uniqueFileIdentifier = testRunUUID + "_" + clusterId + "_user-" + _this.process.currentUserName();
            var outputFileName = uniqueFileIdentifier + ".json";
            var jsonResultFilePath = _this.path.join(cucumberOutputPath, outputFileName);
            var envVars = _this.process.environmentVariables().clone();
            envVars.add('clusterId', clusterId);
            var cucumberRunConfiguration = _this.cucumber.newCucumberRunConfiguration(false, jsonResultFilePath, cucumberPassThruCommands.join(' '), envVars);
            var cluster = _this.clusterTesting.clusterForId(clusterId);
            return _this.cucumber.newCucumberRunner(_this.process, _this.console).runCucumber(cucumberRunConfiguration)
                .then(function (cucumberTestResult) {
                return _this.clusterLogCapturer.captureLogs(cluster)
                    .catch(function (error) {
                    _this.console.log("Error capturing logs for cluster: " + error.toString());
                    return _this.collections.newEmptyList();
                })
                    .then(function (logs) {
                    return cluster.versionGraph()
                        .then(function (versionGraph) { return _this.resultReporter.saveResult(versionGraph, null, cucumberTestResult, uniqueFileIdentifier, clusterConfiguration, logs); })
                        .catch(function (versionGraphError) { return _this.resultReporter.saveResult(null, versionGraphError, cucumberTestResult, uniqueFileIdentifier, clusterConfiguration, logs); });
                });
            });
        });
        return this.promiseFactory.newGroupPromise(clusterTestResultPromises)
            .then(function (clusterTestResults) {
            _this.console.log("Test Run GUID : " + testRunUUID);
            return clusterTestResults;
        });
    };
    return MultiClusterTester;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MultiClusterTester;
//# sourceMappingURL=multi-cluster-tester.js.map