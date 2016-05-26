"use strict";
module.exports = function () {
    this.When(/^I specify the query range start as "([^"]*)"$/, function (queryRangeStart) {
        this.queryRangeStart = queryRangeStart;
    });
    this.When(/^I query for the following metrics:$/, function (table) {
        var _this = this;
        this.metricNames = $.cucumber.getArrayFromTable(table);
        var metricGroupRequest = $.clusterUnderTest.newOpenTSDBRestClient()
            .then(function (c) {
            return $.promiseFactory.newGroupPromise(_this.metricNames.map(function (metricName) { return c.queryForMetric(_this.queryRangeStart, metricName); }));
        })
            .then(function (openTSDBResults) {
            _this.openTSDBResults = openTSDBResults;
        });
        return $.expect(metricGroupRequest).to.eventually.be.fulfilled;
    });
    this.When(/^I query for the following metrics using tags:$/, function (table) {
        var _this = this;
        this.metricNames = $.cucumber.getArrayFromTable(table);
        var metricGroupRequest = $.clusterUnderTest.newOpenTSDBRestClient()
            .then(function (c) {
            return $.promiseFactory.newGroupPromise(_this.metricNames.map(function (metricName) { return c.queryForMetricWithTags(_this.queryRangeStart, metricName, _this.soughtTags); }));
        })
            .then(function (openTSDBResults) { return _this.openTSDBResults = openTSDBResults; });
        return $.expect(metricGroupRequest).to.eventually.be.fulfilled;
    });
    this.When(/^I query for each volume using tag key "([^"]*)" and tag value as the name of the volume$/, function (tagKey) {
        this.soughtTags = $.collections.newEmptyDictionary();
        this.soughtTags.add(tagKey, this.volumeName);
    });
    this.Then(/^I receive at least "([^"]*)" values per metric covering that time period$/, function (numExpectedValuesPerMetricString) {
        var numExpectedValuesPerMetric = parseInt(numExpectedValuesPerMetricString);
        var openTSDBResults = this.openTSDBResults;
        var badOpenTSDBResults = openTSDBResults.filter(function (q) {
            return q.numberOfEntries < numExpectedValuesPerMetric;
        });
        if (badOpenTSDBResults.length > 0) {
            var details = badOpenTSDBResults.map(function (b) { return b.toString(); }).join("\n");
            throw new Error("The following requests yielded insufficient results: " + details);
        }
    });
    this.Then(/^the "([^"]*)" value from maprcli matches the value from OpenTSDB$/, function (volumeProperty) {
        console.log("Checking for the volume property " + volumeProperty);
        $.expect(this.collectdValue).to.equal(this[volumeProperty]);
    });
    this.Then(/^those values may be incorrect but we are only testing for presence$/, function () { });
    this.When(/^I query the following tag names for "([^"]*)" metric:$/, function (metricName, table) {
        var _this = this;
        var metricGroupRequest = $.clusterUnderTest.newOpenTSDBRestClient()
            .then(function (c) {
            var rowList = $.collections.newList(table.rows());
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
    });
};
//# sourceMappingURL=open-tsdb-steps.js.map