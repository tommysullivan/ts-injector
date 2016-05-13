"use strict";
var CucumberTestResult = (function () {
    function CucumberTestResult(cucumberFeatureResults, processResult, caseInsensitiveComparator, cucumberRunConfig, resultAcquisitionError, errors, startTime, endTime) {
        this._cucumberFeatureResults = cucumberFeatureResults;
        this._processResult = processResult;
        this.caseInsensitiveComparator = caseInsensitiveComparator;
        this.cucumberRunConfig = cucumberRunConfig;
        this.resultAcquisitionError = resultAcquisitionError;
        this.errors = errors;
        this.startTime = startTime;
        this.endTime = endTime;
    }
    CucumberTestResult.prototype.uniqueTagNames = function () {
        try {
            return this._cucumberFeatureResults
                .flatMap(function (c) { return c.uniqueTagNames(); })
                .unique()
                .sortWith(this.caseInsensitiveComparator);
        }
        catch (e) {
            throw this.errors.newErrorWithCause(e, "Could not retrieve tags due to error obtaining or traversing the test result. Details: " + this.toString());
        }
    };
    Object.defineProperty(CucumberTestResult.prototype, "processResult", {
        get: function () { return this._processResult; },
        enumerable: true,
        configurable: true
    });
    CucumberTestResult.prototype.consoleOutput = function () {
        return this.processResult.stdoutLines().join("\n");
    };
    CucumberTestResult.prototype.toJSON = function () {
        return {
            cucumberFeatureResults: this._cucumberFeatureResults ? this._cucumberFeatureResults.map(function (c) { return c.toJSON(); }) : null,
            processResult: this.processResult.toJSON(),
            cucumberRunConfig: this.cucumberRunConfig.toJSON(),
            resultAcquisitionError: this.resultAcquisitionError,
            startTime: this.startTime.getTime(),
            endTime: this.endTime.getTime()
        };
    };
    CucumberTestResult.prototype.toJSONString = function () {
        return JSON.stringify(this.toJSON(), null, 3);
    };
    CucumberTestResult.prototype.toString = function () {
        return this.toJSONString();
    };
    return CucumberTestResult;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CucumberTestResult;
//# sourceMappingURL=cucumber-test-result.js.map