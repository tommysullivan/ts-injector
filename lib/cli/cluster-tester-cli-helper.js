"use strict";
var ClusterTesterCliHelper = (function () {
    function ClusterTesterCliHelper(process, console, uuidGenerator, cucumber, clusterTestingConfiguration, cliHelper, clusterTesting, frameworkConfig, path, fileSystem, rest, clusters) {
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
    }
    ClusterTesterCliHelper.prototype.executeTestRunCli = function () {
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
            else
                throw new Error("Invalid command " + subCommand);
        }
        catch (e) {
            this.logTestRunUsage();
            throw e;
        }
    };
    //TODO: Decouple private methods from CLI and move to clusterTester so they can be invoked programmatically
    ClusterTesterCliHelper.prototype.runCucumber = function (cucumberPassThruCommands) {
        var _this = this;
        var env = this.process.environmentVariables();
        var testRunUUID = this.uuidGenerator.v4();
        var phase = this.clusterTestingConfiguration.defaultPhase;
        var clusterId = this.process.environmentVariableNamed('clusterId');
        var clusterConfiguration = this.clusters.clusterConfigurationWithId(clusterId);
        var cucumberOutputPath = this.clusterTestingConfiguration.cucumberOutputPath;
        var uniqueFileIdentifier = testRunUUID + "_" + clusterId + "_phase-" + phase + "_user-" + this.process.currentUserName();
        var outputFileName = uniqueFileIdentifier + ".json";
        var jsonResultFilePath = this.path.join(cucumberOutputPath, outputFileName);
        var cucumberRunConfiguration = this.cucumber.newCucumberRunConfiguration(false, jsonResultFilePath, cucumberPassThruCommands.join(' '), this.process.environmentVariables().clone());
        this.cucumber.newCucumberRunner(this.process, this.console).runCucumber(cucumberRunConfiguration)
            .then(function (cucumberTestResult) {
            return _this.cliHelper.clusterForId(clusterId).versionGraph()
                .then(function (versionGraph) { return _this.saveResult(versionGraph, null, cucumberRunConfiguration, cucumberTestResult, uniqueFileIdentifier, clusterConfiguration); })
                .catch(function (versionGraphError) { return _this.saveResult(null, versionGraphError, cucumberRunConfiguration, cucumberTestResult, uniqueFileIdentifier, clusterConfiguration); });
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
            this.rest.newRestClientAsPromised().put(fullUrl, putArgs)
                .then(function (result) { return _this.console.log('Success'); })
                .catch(function (error) { return _this.cliHelper.logError(error); });
        }
        else {
            var locationOfConfiguredPortalUrls = 'the configuration json file, under "clusterTesting.resultServers"';
            this.console.log("Not saving result to portal. To do so, set ENV variable \"portalId\" to value in " + locationOfConfiguredPortalUrls);
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
            'cucumber [args passed thru to cucumber.js]      reset cluster power or turn it off or on'
        ].join('\n'));
    };
    return ClusterTesterCliHelper;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ClusterTesterCliHelper;
//# sourceMappingURL=cluster-tester-cli-helper.js.map