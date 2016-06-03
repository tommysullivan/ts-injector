"use strict";
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
    Object.defineProperty(CucumberConfiguration.prototype, "defaultCucumberStepTimeoutMS", {
        get: function () {
            return this.cucumberConfigJSON.numericPropertyNamed('defaultCucumberStepTimeoutMS');
        },
        enumerable: true,
        configurable: true
    });
    CucumberConfiguration.prototype.cucumberExecutablePath = function () {
        return this.cucumberConfigJSON.stringPropertyNamed('cucumberExecutablePath');
    };
    Object.defineProperty(CucumberConfiguration.prototype, "featureSetsJSONArray", {
        get: function () {
            return this.cucumberConfigJSON.listOfJSONObjectsNamed('featureSets');
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