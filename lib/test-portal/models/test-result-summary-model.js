"use strict";
var TestResultSummaryModel = (function () {
    function TestResultSummaryModel(summaryJSON) {
        this.summaryJSON = summaryJSON;
    }
    Object.defineProperty(TestResultSummaryModel.prototype, "type", {
        get: function () { return this.summaryJSON.stringPropertyNamed('type'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TestResultSummaryModel.prototype, "jiraKey", {
        get: function () { return this.summaryJSON.stringPropertyNamed('jiraKey'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TestResultSummaryModel.prototype, "total", {
        get: function () { return this.summaryJSON.numericPropertyNamed('total'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TestResultSummaryModel.prototype, "passed", {
        get: function () { return this.summaryJSON.numericPropertyNamed('passed'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TestResultSummaryModel.prototype, "failed", {
        get: function () { return this.summaryJSON.numericPropertyNamed('failed'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TestResultSummaryModel.prototype, "notExecuted", {
        get: function () { return this.summaryJSON.numericPropertyNamed('notExecuted'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TestResultSummaryModel.prototype, "pending", {
        get: function () { return this.summaryJSON.numericPropertyNamed('pending'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TestResultSummaryModel.prototype, "displayText", {
        get: function () {
            return (this.type + " - " + this.total + " (") +
                ("(" + this.failed + " failed, " + this.passed + " passed, " + this.pending) +
                ("pending, " + this.notExecuted + " not executed)");
        },
        enumerable: true,
        configurable: true
    });
    return TestResultSummaryModel;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TestResultSummaryModel;
//# sourceMappingURL=test-result-summary-model.js.map