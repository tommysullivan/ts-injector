"use strict";
var CucumberFeatureResult = (function () {
    function CucumberFeatureResult(rawCucumberFeatureJSON, collections, cucumber) {
        this.rawCucumberFeatureJSON = rawCucumberFeatureJSON;
        this.collections = collections;
        this.cucumber = cucumber;
    }
    CucumberFeatureResult.prototype.uniqueTagNames = function () {
        return this.scenarios().flatMap(function (s) { return s.tags(); }).map(function (t) { return t.name(); }).unique();
    };
    CucumberFeatureResult.prototype.scenarios = function () {
        var _this = this;
        var scenariosJSONs = this.rawCucumberFeatureJSON.listOfJSONObjectsNamed('elements');
        return scenariosJSONs.map(function (scenarioJSON) { return _this.cucumber.newCucumberScenarioResult(scenarioJSON); });
    };
    CucumberFeatureResult.prototype.toJSON = function () {
        return this.rawCucumberFeatureJSON.toRawJSON();
    };
    return CucumberFeatureResult;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CucumberFeatureResult;
//# sourceMappingURL=cucumber-feature-result.js.map