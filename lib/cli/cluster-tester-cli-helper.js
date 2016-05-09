"use strict";
var ClusterTesterCliHelper = (function () {
    function ClusterTesterCliHelper(process, console, uuidGenerator, cucumber, clusterTestingConfiguration, cliHelper, clusterTesting, frameworkConfig, path, fileSystem, rest, clusters, promiseFactory, collections) {
        this.process = process;
        this.console = console;
        this.uuidGenerator = uuidGenerator;
        this.cucumber = cucumber;
        this.clusterTestingConfiguration = clusterTestingConfiguration;
        this.cliHelper = cliHelper;
        this.clusterTesting = clusterTesting;
        this.frameworkConfig = frameworkConfig;
        this.path = path;
        this.fileSystem = fileSystem;
        this.rest = rest;
        this.clusters = clusters;
        this.promiseFactory = promiseFactory;
        this.collections = collections;
    }
    ClusterTesterCliHelper.prototype.executeTestRunCli = function () {
        var _this = this;
        try {
            var subCommand = this.process.getArgvOrThrow('subCommand', 3);
            if (subCommand == 'cucumber') {
                var cucumberPassThruCommands = this.process.commandLineArguments().everythingAfterIndex(3);
                this.runCucumber(cucumberPassThruCommands);
            }
            else if (subCommand == 'featureSet') {
                var featureSetId = this.process.getArgvOrThrow('featureSetId', 4);
                var featureSet = this.cucumber.allFeatureSets.firstWhere(function (f) { return f.id == featureSetId; });
                var cucumberPassThruCommands = featureSet.featureFilesInExecutionOrder.append(this.process.commandLineArguments().everythingAfterIndex(4));
                this.runCucumber(cucumberPassThruCommands);
            }
            else if (subCommand == 'command') {
                var command = this.process.commandLineArguments().everythingAfterIndex(3).join(' ');
                var clusters = this.clusterIds.map(function (clusterId) { return _this.clusterTesting.newClusterUnderTest(_this.clusters.clusterConfigurationWithId(clusterId)); });
                var restrictNodesBasedOnServices = this.process.environmentVariables().hasKey('nodesWith');
                clusters.forEach(function (cluster) {
                    var nodesForShellCommand = restrictNodesBasedOnServices
                        ? _this.nodesRunningRequestedServices(cluster)
                        : cluster.nodes();
                    var commandPromises = nodesForShellCommand.map(function (n) { return n.executeShellCommand(command); });
                    _this.promiseFactory.newGroupPromise(commandPromises)
                        .then(function (result) {
                        _this.console.log('*****************************************');
                        _this.console.log("Cluster Result for id \"" + cluster.name);
                        _this.console.log("\n");
                        _this.console.log(result.toJSONString());
                    });
                });
            }
            else
                throw new Error("Invalid command " + subCommand);
        }
        catch (e) {
            this.logTestRunUsage();
            throw e;
        }
    };
    ClusterTesterCliHelper.prototype.nodesRunningRequestedServices = function (cluster) {
        var requisiteServiceNames = this.collections.newList(this.process.environmentVariableNamed('nodesWith').split(','));
        return cluster.nodes().where(function (n) { return n.serviceNames.containAll(requisiteServiceNames); });
    };
    Object.defineProperty(ClusterTesterCliHelper.prototype, "clusterIds", {
        get: function () {
            return this.collections.newList(this.process.environmentVariables().hasKey('clusterIds')
                ? this.process.environmentVariableNamed('clusterIds').split(',')
                : [this.process.environmentVariableNamed('clusterId')]);
        },
        enumerable: true,
        configurable: true
    });
    //TODO: Decouple private methods from CLI and move to clusterTester so they can be invoked programmatically
    ClusterTesterCliHelper.prototype.runCucumber = function (cucumberPassThruCommands) {
        var _this = this;
        var env = this.process.environmentVariables();
        var testRunUUID = this.uuidGenerator.v4();
        var phase = this.clusterTestingConfiguration.defaultPhase;
        var clusterIds = this.clusterIds;
        var clusterTestResultPromises = clusterIds.map(function (clusterId) {
            var clusterConfiguration = _this.clusters.clusterConfigurationWithId(clusterId);
            var cucumberOutputPath = _this.clusterTestingConfiguration.cucumberOutputPath;
            var uniqueFileIdentifier = testRunUUID + "_" + clusterId + "_phase-" + phase + "_user-" + _this.process.currentUserName();
            var outputFileName = uniqueFileIdentifier + ".json";
            var jsonResultFilePath = _this.path.join(cucumberOutputPath, outputFileName);
            var envVars = _this.process.environmentVariables().clone();
            envVars.add('clusterId', clusterId);
            var cucumberRunConfiguration = _this.cucumber.newCucumberRunConfiguration(false, jsonResultFilePath, cucumberPassThruCommands.join(' '), envVars);
            return _this.cucumber.newCucumberRunner(_this.process, _this.console).runCucumber(cucumberRunConfiguration)
                .then(function (cucumberTestResult) {
                if (cucumberTestResult.processResult.hasError())
                    cucumberTestResult.processResult.stderrLines().map(function (l) { return _this.console.log(l); });
                return _this.cliHelper.clusterForId(clusterId).versionGraph()
                    .then(function (versionGraph) { return _this.saveResult(versionGraph, null, cucumberRunConfiguration, cucumberTestResult, uniqueFileIdentifier, clusterConfiguration); })
                    .catch(function (versionGraphError) { return _this.saveResult(null, versionGraphError, cucumberRunConfiguration, cucumberTestResult, uniqueFileIdentifier, clusterConfiguration); });
            });
        });
        this.promiseFactory.newGroupPromise(clusterTestResultPromises)
            .then(function (clusterTestResults) {
            var allPassed = clusterTestResults.all(function (t) { return t.passed(); });
            if (clusterTestResults.length > 1) {
                _this.console.log("Multi Cluster Test of " + clusterTestResults.length + " clusters " + (allPassed ? 'Passed' : 'Failed'));
                clusterTestResults.forEach(function (result) {
                    _this.console.log("Cluster " + result.clusterId + ": " + (result.passed() ? 'passed' : 'failed'));
                });
            }
            _this.process.exit(allPassed ? 0 : 1);
        })
            .catch(function (e) { return _this.cliHelper.logError(e); });
    };
    //TODO: Decouple private methods from CLI and move to clusterTester so they can be invoked programmatically
    ClusterTesterCliHelper.prototype.saveResult = function (versionGraph, versionGraphError, cucumberRunConfiguration, cucumberTestResult, uniqueFileIdentifier, clusterConfiguration) {
        var _this = this;
        var clusterTestResult = this.clusterTesting.newClusterTestResult(cucumberRunConfiguration, cucumberTestResult, this.frameworkConfig, versionGraph, versionGraphError, clusterConfiguration);
        this.console.log(cucumberTestResult.consoleOutput());
        var outputFileName = uniqueFileIdentifier + ".json";
        var frameworkOutputPath = this.path.join(this.clusterTestingConfiguration.frameworkOutputPath, outputFileName);
        this.fileSystem.writeFileSync(frameworkOutputPath, clusterTestResult.toString());
        if (this.process.environmentVariables().hasKey('portalId')) {
            var portalId = this.process.environmentVariableNamed('portalId');
            var url = this.clusterTestingConfiguration.portalUrlWithId(portalId);
            var fullUrl = url + "/test-results/" + uniqueFileIdentifier;
            var putArgs = {
                body: clusterTestResult.toJSON(),
                json: true
            };
            var portalInfo = "portal id \"" + portalId + "\" at url \"" + fullUrl + "\"";
            this.console.log("Saving result to " + portalInfo);
            return this.rest.newRestClientAsPromised().put(fullUrl, putArgs)
                .then(function (result) { return _this.console.log('Success'); })
                .catch(function (error) { return _this.cliHelper.logError(error); })
                .then(function (_) { return clusterTestResult; });
        }
        else {
            var locationOfConfiguredPortalUrls = 'the configuration json file, under "clusterTesting.resultServers"';
            this.console.log("Not saving result to portal. To do so, set ENV variable \"portalId\" to value in " + locationOfConfiguredPortalUrls);
            return this.promiseFactory.newPromiseForImmediateValue(clusterTestResult);
        }
    };
    ClusterTesterCliHelper.prototype.logTestRunUsage = function () {
        this.console.log([
            '',
            'Usage:',
            (this.process.processName() + " run [target]"),
            '',
            'targets                                         description',
            '-------                                         -----------',
            'featureSet [featureSetId]                       run cucumber with the specified featureset (to list available run command "featureSets")',
            'cucumber [args passed thru to cucumber.js]      reset cluster power or turn it off or on',
            'command [command]                               run arbitrary command on each node in cluster(s). If environment variable "nodesWith" is set',
            '                                                to a comma separated list of service names, then commands will only run on nodes that have those services'
        ].join('\n'));
    };
    return ClusterTesterCliHelper;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ClusterTesterCliHelper;
//# sourceMappingURL=cluster-tester-cli-helper.js.map