"use strict";
var feature_set_1 = require("./feature-set");
var CucumberConfiguration = (function () {
    function CucumberConfiguration(cucumberConfigJSON) {
        this.cucumberConfigJSON = cucumberConfigJSON;
    }
    Object.defineProperty(CucumberConfiguration.prototype, "embedAsyncErrorsInStepOutput", {
        get: function () {
            return this.cucumberConfigJSON.booleanPropertyNamed('embedAsyncErrorsInStepOutput');
        },
        enumerable: true,
        configurable: true
    });
    CucumberConfiguration.prototype.defaultCucumberStepTimeoutMS = function () {
        return this.cucumberConfigJSON.numericPropertyNamed('defaultCucumberStepTimeoutMS');
    };
    CucumberConfiguration.prototype.cucumberExecutablePath = function () {
        return this.cucumberConfigJSON.stringPropertyNamed('cucumberExecutablePath');
    };
    Object.defineProperty(CucumberConfiguration.prototype, "featureSets", {
        get: function () {
            return this.cucumberConfigJSON.listOfJSONObjectsNamed('featureSets').map(function (testSuiteJSON) { return new feature_set_1.default(testSuiteJSON); });
        },
        enumerable: true,
        configurable: true
    });
    CucumberConfiguration.prototype.toJSON = function () { return this.cucumberConfigJSON.toRawJSON(); };
    CucumberConfiguration.prototype.toString = function () { return this.cucumberConfigJSON.toString(); };
    return CucumberConfiguration;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CucumberConfiguration;
//# sourceMappingURL=cucumber-configuration.js.map