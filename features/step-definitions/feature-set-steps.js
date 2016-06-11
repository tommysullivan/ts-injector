"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var cucumber_tsflow_1 = require("cucumber-tsflow");
var FeatureSetSteps = (function () {
    function FeatureSetSteps() {
    }
    FeatureSetSteps.prototype.setFeatureSetConfiguration = function (configJSON) {
        this.featureSetConfiguration = configJSON;
    };
    FeatureSetSteps.prototype.queryForFeatureFilesForSet = function (featureSetId) {
        this.featureFileNames = $.cucumber.newFeatureSets($.typedJSON.newListOfJSONObjects(JSON.parse(this.featureSetConfiguration))).setWithId(featureSetId).featureFilesInExecutionOrder;
    };
    FeatureSetSteps.prototype.verifyJSONResult = function (expectedResultJSON) {
        $.expect(this.featureFileNames.toArray()).to.deep.equal(JSON.parse(expectedResultJSON));
    };
    __decorate([
        cucumber_tsflow_1.given(/^I have defined feature sets configuration thusly:$/)
    ], FeatureSetSteps.prototype, "setFeatureSetConfiguration", null);
    __decorate([
        cucumber_tsflow_1.when(/^I query for a json array of feature files names for the "([^"]*)" feature set$/)
    ], FeatureSetSteps.prototype, "queryForFeatureFilesForSet", null);
    __decorate([
        cucumber_tsflow_1.then(/^I get a json array that looks like this:$/)
    ], FeatureSetSteps.prototype, "verifyJSONResult", null);
    FeatureSetSteps = __decorate([
        cucumber_tsflow_1.binding()
    ], FeatureSetSteps);
    return FeatureSetSteps;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FeatureSetSteps;
module.exports = FeatureSetSteps;
//# sourceMappingURL=feature-set-steps.js.map