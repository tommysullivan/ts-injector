"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var cucumber_tsflow_1 = require("cucumber-tsflow");
var OpenTSBBSteps = (function () {
    function OpenTSBBSteps() {
    }
    OpenTSBBSteps.prototype.specifyRangeStart = function (queryRangeStart) {
        this.queryRangeStart = queryRangeStart;
    };
    OpenTSBBSteps.prototype.queryForMetrics = function (table) {
        var _this = this;
        this.metricNames = $.cucumber.getListOfStringsFromTable(table);
        var metricGroupRequest = $.clusterUnderTest.newOpenTSDBRestClient()
            .then(function (c) {
            return $.promiseFactory.newGroupPromise(_this.metricNames.map(function (metricName) { return c.queryForMetric(_this.queryRangeStart, metricName); }));
        })
            .then(function (openTSDBResults) {
            _this.openTSDBResults = openTSDBResults;
        });
        return $.expect(metricGroupRequest).to.eventually.be.fulfilled;
    };
    OpenTSBBSteps.prototype.queryForMetricsUsingPreviouslySpecifiedTags = function (table) {
        var _this = this;
        this.metricNames = $.cucumber.getListOfStringsFromTable(table);
        var futureOpenTSDBResults = $.clusterUnderTest.newOpenTSDBRestClient()
            .then(function (otsdb) { return $.promiseFactory.newGroupPromise(_this.metricNames.map(function (metricName) { return otsdb.queryForMetricWithTags(_this.queryRangeStart, metricName, _this.soughtTags); })); })
            .then(function (openTSDBResults) { return _this.openTSDBResults = openTSDBResults; });
        return $.expect(futureOpenTSDBResults).to.eventually.be.fulfilled;
    };
    OpenTSBBSteps.prototype.queryForEachVolumeUsingSpecifiedKeyWhereValueIsAlwaysVolumeName = function (tagKey) {
        this.soughtTags = $.collections.newEmptyDictionary();
        this.soughtTags.add(tagKey, this.volumeName);
    };
    OpenTSBBSteps.prototype.verifyMinimumNumberOfValuesForTimePeriod = function (numExpectedValuesPerMetricString) {
        var numExpectedValuesPerMetric = parseInt(numExpectedValuesPerMetricString);
        var openTSDBResults = this.openTSDBResults;
        var badOpenTSDBResults = openTSDBResults.filter(function (q) {
            return q.numberOfEntries < numExpectedValuesPerMetric;
        });
        $.expectEmptyList(badOpenTSDBResults);
    };
    OpenTSBBSteps.prototype.verifyMaprCliMatchesValueFromOpenTSDB = function (volumeProperty) {
        console.log("Checking for the volume property " + volumeProperty);
        $.expect(this.collectdValue).to.equal(this.volumeDictionary.get(volumeProperty));
    };
    OpenTSBBSteps.prototype.englishNotificationOnly = function () { };
    //TODO: any?
    OpenTSBBSteps.prototype.queryTagNamesForMetric = function (metricName, tableOfTagNames) {
        var _this = this;
        var metricGroupRequest = $.clusterUnderTest.newOpenTSDBRestClient()
            .then(function (c) {
            var rowList = $.collections.newList(tableOfTagNames.rows());
            return $.promiseFactory.newGroupPromise(rowList.flatMap(function (r) {
                var tagValues = $.collections.newList(r[1].split(","));
                var tagName = r[0];
                return tagValues.map(function (tagValue) {
                    var soughtTags = $.collections.newEmptyDictionary();
                    soughtTags.add(tagName, tagValue);
                    return c.queryForMetricWithTags(_this.queryRangeStart, metricName, soughtTags);
                });
            }));
        })
            .then(function (openTSDBResults) { return _this.openTSDBResults = openTSDBResults; });
        return $.expect(metricGroupRequest).to.eventually.be.fulfilled;
    };
    __decorate([
        cucumber_tsflow_1.when(/^I specify the query range start as "([^"]*)"$/)
    ], OpenTSBBSteps.prototype, "specifyRangeStart", null);
    __decorate([
        cucumber_tsflow_1.when(/^I query for the following metrics:$/)
    ], OpenTSBBSteps.prototype, "queryForMetrics", null);
    __decorate([
        cucumber_tsflow_1.when(/^I query for the following metrics using tags:$/)
    ], OpenTSBBSteps.prototype, "queryForMetricsUsingPreviouslySpecifiedTags", null);
    __decorate([
        cucumber_tsflow_1.when(/^I query for each volume using tag key "([^"]*)" and tag value as the name of the volume$/)
    ], OpenTSBBSteps.prototype, "queryForEachVolumeUsingSpecifiedKeyWhereValueIsAlwaysVolumeName", null);
    __decorate([
        cucumber_tsflow_1.then(/^I receive at least "([^"]*)" values per metric covering that time period$/)
    ], OpenTSBBSteps.prototype, "verifyMinimumNumberOfValuesForTimePeriod", null);
    __decorate([
        cucumber_tsflow_1.then(/^the "([^"]*)" value from maprcli matches the value from OpenTSDB$/)
    ], OpenTSBBSteps.prototype, "verifyMaprCliMatchesValueFromOpenTSDB", null);
    __decorate([
        cucumber_tsflow_1.then(/^those values may be incorrect but we are only testing for presence$/)
    ], OpenTSBBSteps.prototype, "englishNotificationOnly", null);
    __decorate([
        cucumber_tsflow_1.when(/^I query the following tag names for "([^"]*)" metric:$/)
    ], OpenTSBBSteps.prototype, "queryTagNamesForMetric", null);
    OpenTSBBSteps = __decorate([
        cucumber_tsflow_1.binding()
    ], OpenTSBBSteps);
    return OpenTSBBSteps;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = OpenTSBBSteps;
module.exports = OpenTSBBSteps;
//# sourceMappingURL=open-tsdb-steps.js.map