"use strict";
var CucumberScenarioResult = (function () {
    function CucumberScenarioResult(scenarioJSON, cucumber) {
        this.scenarioJSON = scenarioJSON;
        this.cucumber = cucumber;
    }
    CucumberScenarioResult.prototype.tags = function () {
        var _this = this;
        return this.scenarioJSON.listOfJSONObjectsNamedOrDefaultToEmpty('tags').map(function (tagJSON) { return _this.cucumber.newCucumberTag(tagJSON); });
    };
    return CucumberScenarioResult;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CucumberScenarioResult;
//# sourceMappingURL=cucumber-scenario-result.js.map