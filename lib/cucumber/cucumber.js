"use strict";
var cucumber_scenario_result_1 = require("./cucumber-scenario-result");
var cucumber_tag_1 = require("./cucumber-tag");
var cucumber_test_result_1 = require("./cucumber-test-result");
var case_insensitive_comparator_1 = require("../collections/case-insensitive-comparator");
var cucumber_runner_1 = require("./cucumber-runner");
var cucumber_run_configuration_1 = require("./cucumber-run-configuration");
var cucumber_feature_result_1 = require("./cucumber-feature-result");
var feature_set_1 = require("./feature-set");
var feature_sets_1 = require("./feature-sets");
var Cucumber = (function () {
    function Cucumber(collections, fileSystem, cucumberConfig, errors) {
        this.collections = collections;
        this.fileSystem = fileSystem;
        this.cucumberConfig = cucumberConfig;
        this.errors = errors;
    }
    Object.defineProperty(Cucumber.prototype, "world", {
        get: function () {
            var timeout = this.cucumberConfig.defaultCucumberStepTimeoutMS;
            return function setupCucumberWorldObject() {
                this.setDefaultTimeout(timeout);
            };
        },
        enumerable: true,
        configurable: true
    });
    Cucumber.prototype.newFeatureSet = function (configJSON, featureSets) {
        return new feature_set_1.default(configJSON, this.collections, featureSets);
    };
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
    Cucumber.prototype.getListOfStringsFromTable = function (table) {
        return this.collections.newList(table.rows().map(function (r) { return r[0]; }));
    };
    Cucumber.prototype.newManualStep = function (numberOfArgs) {
        return [
            function () { return null; },
            function (a) { return null; },
            function (a, b) { return null; },
            function (a, b, c) { return null; },
            function (a, b, c, d) { return null; }
        ][numberOfArgs];
    };
    Object.defineProperty(Cucumber.prototype, "featureSets", {
        get: function () {
            return this.newFeatureSets(this.cucumberConfig.featureSetsJSONArray);
        },
        enumerable: true,
        configurable: true
    });
    Cucumber.prototype.newFeatureSets = function (featureSetsJSONArray) {
        return new feature_sets_1.default(featureSetsJSONArray, this);
    };
    return Cucumber;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Cucumber;
//# sourceMappingURL=cucumber.js.map