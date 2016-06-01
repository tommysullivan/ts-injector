"use strict";
var cucumber_scenario_result_1 = require("./cucumber-scenario-result");
var cucumber_tag_1 = require("./cucumber-tag");
var cucumber_test_result_1 = require("./cucumber-test-result");
var case_insensitive_comparator_1 = require("../collections/case-insensitive-comparator");
var cucumber_runner_1 = require("./cucumber-runner");
var cucumber_run_configuration_1 = require("./cucumber-run-configuration");
var cucumber_feature_result_1 = require("./cucumber-feature-result");
var step_definitions_1 = require("./step-definitions");
var Cucumber = (function () {
    function Cucumber(collections, fileSystem, cucumberConfig, errors) {
        this.collections = collections;
        this.fileSystem = fileSystem;
        this.cucumberConfig = cucumberConfig;
        this.errors = errors;
    }
    Object.defineProperty(Cucumber.prototype, "allFeatureSets", {
        get: function () {
            return this.cucumberConfig.featureSets;
        },
        enumerable: true,
        configurable: true
    });
    Cucumber.prototype.stepDefinitionsFor = function (thisObjectWithinStepDefinitionFileExportFunction) {
        return new step_definitions_1.default(thisObjectWithinStepDefinitionFileExportFunction);
    };
    Cucumber.prototype.featureSetWithId = function (id) {
        return this.allFeatureSets.firstWhere(function (f) { return f.id == id; });
    };
    Object.defineProperty(Cucumber.prototype, "world", {
        get: function () {
            return function setupCucumberWorldObject() {
                this.setDefaultTimeout(120000);
            };
        },
        enumerable: true,
        configurable: true
    });
    Cucumber.prototype.newCucumberRunConfiguration = function (isDryRun, jsonResultFilePath, cucumberAdditionalArgs, envVariables) {
        return new cucumber_run_configuration_1.default(envVariables, cucumberAdditionalArgs, isDryRun, 'node_modules/cucumber/bin/cucumber.js', jsonResultFilePath);
    };
    Cucumber.prototype.newCucumberScenarioResult = function (resultJSON) {
        return new cucumber_scenario_result_1.default(resultJSON, this);
    };
    Cucumber.prototype.newCucumberFeatureResult = function (rawCucumberFeatureJSON) {
        return new cucumber_feature_result_1.default(rawCucumberFeatureJSON, this.collections, this);
    };
    Cucumber.prototype.newCucumberTag = function (tagJSON) {
        return new cucumber_tag_1.default(tagJSON);
    };
    Cucumber.prototype.newCucumberTestResult = function (cucumberFeatureResults, processResult, cucumberRunConfiguration, resultAcquisitionError, startTime, endTime) {
        return new cucumber_test_result_1.default(cucumberFeatureResults, processResult, case_insensitive_comparator_1.default, cucumberRunConfiguration, resultAcquisitionError, this.errors, startTime, endTime);
    };
    Cucumber.prototype.newCucumberRunner = function (process, console) {
        return new cucumber_runner_1.default(process, console, this.fileSystem, this.collections, this, this.cucumberConfig);
    };
    Cucumber.prototype.getArrayFromTable = function (table) {
        return this.collections.newList(table.rows().map(function (r) { return r[0]; }));
    };
    return Cucumber;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Cucumber;
//# sourceMappingURL=cucumber.js.map