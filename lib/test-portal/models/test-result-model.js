"use strict";
var TestResultModel = (function () {
    function TestResultModel(json, testPortal) {
        this.json = json;
        this.testPortal = testPortal;
    }
    Object.defineProperty(TestResultModel.prototype, "status", {
        get: function () { return this.json.stringPropertyNamed('status'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TestResultModel.prototype, "jiraKey", {
        get: function () { return this.json.stringPropertyNamed('jiraKey'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TestResultModel.prototype, "testResultURL", {
        get: function () { return this.json.stringPropertyNamed('testResultURL'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TestResultModel.prototype, "summaries", {
        get: function () {
            var _this = this;
            return this.json.listOfJSONObjectsNamed('summaries').map(function (s) { return _this.testPortal.newTestResultSummaryModel(s); });
        },
        enumerable: true,
        configurable: true
    });
    return TestResultModel;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TestResultModel;
//# sourceMappingURL=test-result-model.js.map