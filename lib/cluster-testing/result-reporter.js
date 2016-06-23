"use strict";
var ResultReporter = (function () {
    function ResultReporter(frameworkConfig, fileSystem, rest, clusterTesting, console, clusterTestingConfiguration, process, promiseFactory, path) {
        this.frameworkConfig = frameworkConfig;
        this.fileSystem = fileSystem;
        this.rest = rest;
        this.clusterTesting = clusterTesting;
        this.console = console;
        this.clusterTestingConfiguration = clusterTestingConfiguration;
        this.process = process;
        this.promiseFactory = promiseFactory;
        this.path = path;
    }
    ResultReporter.prototype.saveResult = function (versionGraph, versionGraphError, cucumberTestResult, uniqueFileIdentifier, clusterConfiguration, logs) {
        var _this = this;
        var clusterTestResult = this.clusterTesting.newClusterTestResult(cucumberTestResult, this.frameworkConfig, versionGraph, versionGraphError, clusterConfiguration, logs);
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
                .catch(function (error) { return _this.console.log(error.toString()); })
                .then(function (_) { return clusterTestResult; });
        }
        else {
            var locationOfConfiguredPortalUrls = 'the configuration json file, under "clusterTesting.resultServers"';
            this.console.log("Not saving result to portal. To do so, set ENV variable \"portalId\" to value in " + locationOfConfiguredPortalUrls);
            return this.promiseFactory.newPromiseForImmediateValue(clusterTestResult);
        }
    };
    return ResultReporter;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ResultReporter;
//# sourceMappingURL=result-reporter.js.map