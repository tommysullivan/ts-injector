"use strict";
var CucumberConfiguration = (function () {
    function CucumberConfiguration() {
    }
    CucumberConfiguration.prototype.defaultCucumberStepTimeoutMS = function () {
        return 120000;
    };
    CucumberConfiguration.prototype.cucumberExecutablePath = function () {
        return 'node_modules/cucumber/bin/cucumber.js';
    };
    return CucumberConfiguration;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CucumberConfiguration;
//# sourceMappingURL=cucumber-configuration.js.map