"use strict";
var TestSuiteConfiguration = (function () {
    function TestSuiteConfiguration(testSuiteJSON) {
        this.testSuiteJSON = testSuiteJSON;
    }
    Object.defineProperty(TestSuiteConfiguration.prototype, "id", {
        get: function () { return this.testSuiteJSON.stringPropertyNamed('id'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TestSuiteConfiguration.prototype, "featureFilePaths", {
        get: function () { return this.testSuiteJSON.listNamed('features'); },
        enumerable: true,
        configurable: true
    });
    TestSuiteConfiguration.prototype.toJSON = function () { return this.testSuiteJSON.toRawJSON(); };
    TestSuiteConfiguration.prototype.toString = function () { return this.testSuiteJSON.toString(); };
    return TestSuiteConfiguration;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TestSuiteConfiguration;
//# sourceMappingURL=test-suite-configuration.js.map