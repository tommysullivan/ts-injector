"use strict";
var CucumberRunner = (function () {
    function CucumberRunner(process, console, fileSystem, collections, cucumber, cucumberConfig) {
        this.process = process;
        this.console = console;
        this.fileSystem = fileSystem;
        this.collections = collections;
        this.cucumber = cucumber;
        this.cucumberConfig = cucumberConfig;
    }
    CucumberRunner.prototype.runCucumber = function (cucumberRunConfiguration) {
        var _this = this;
        var additionalArgs = cucumberRunConfiguration.cucumberAdditionalArgs();
        if (cucumberRunConfiguration.isDryRun())
            additionalArgs += ' --dry-run';
        var runCucumberCommand = [
            this.cucumberConfig.cucumberExecutablePath(),
            additionalArgs,
            ("-f json:" + cucumberRunConfiguration.jsonResultFilePath())
        ].join(' ');
        this.console.log('cucumber command: ', runCucumberCommand);
        this.console.log('environment variables: ', cucumberRunConfiguration.environmentVariables().toJSONString());
        return this.process.executeNodeProcess(runCucumberCommand, cucumberRunConfiguration.environmentVariables())
            .then(function (r) { return _this.constructResult(r, cucumberRunConfiguration); }, function (r) { return _this.constructResult(r, cucumberRunConfiguration); });
    };
    CucumberRunner.prototype.constructResult = function (processResult, cucumberRunConfiguration) {
        var _this = this;
        var cucumberFeatureResults = null;
        var resultAcquisitionError = null;
        try {
            var rawCucumberResultJSON = this.fileSystem.readJSONArrayFileSync(cucumberRunConfiguration.jsonResultFilePath());
            cucumberFeatureResults = rawCucumberResultJSON.map(function (featureJSON) { return _this.cucumber.newCucumberFeatureResult(featureJSON); });
        }
        catch (e) {
            resultAcquisitionError = e.toString();
        }
        return this.cucumber.newCucumberTestResult(cucumberFeatureResults, processResult, cucumberRunConfiguration, resultAcquisitionError);
    };
    return CucumberRunner;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CucumberRunner;
//# sourceMappingURL=cucumber-runner.js.map