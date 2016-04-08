"use strict";
var CucumberRunConfiguration = (function () {
    function CucumberRunConfiguration(environmentVariables, cucumberAdditionalArgs, isDryRun, cucumberExecutablePath, jsonResultFilePath) {
        this._environmentVariables = environmentVariables;
        this._cucumberAdditionalArgs = cucumberAdditionalArgs;
        this._isDryRun = isDryRun;
        this._cucumberExecutablePath = cucumberExecutablePath;
        this._jsonResultFilePath = jsonResultFilePath;
    }
    CucumberRunConfiguration.prototype.environmentVariables = function () {
        return this._environmentVariables;
    };
    CucumberRunConfiguration.prototype.jsonResultFilePath = function () {
        return this._jsonResultFilePath;
    };
    CucumberRunConfiguration.prototype.cucumberAdditionalArgs = function () {
        return this._cucumberAdditionalArgs;
    };
    CucumberRunConfiguration.prototype.isDryRun = function () {
        return this._isDryRun;
    };
    CucumberRunConfiguration.prototype.toJSON = function () {
        return {
            environmentVariables: this.environmentVariables().toJSON(),
            jsonResultFilePath: this.jsonResultFilePath(),
            cucumberAdditionalArgs: this.cucumberAdditionalArgs()
        };
    };
    return CucumberRunConfiguration;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CucumberRunConfiguration;
//# sourceMappingURL=cucumber-run-configuration.js.map