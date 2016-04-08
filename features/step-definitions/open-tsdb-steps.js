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
            .then(function (queryResultSets) {
            _this.queryResultSets = queryResultSets;
        });
        return $.expect(metricGroupRequest).to.eventually.be.fulfilled;
    });
    this.Then(/^I receive at least "([^"]*)" values per metric covering that time period$/, function (numExpectedValuesPerMetric) {
        numExpectedValuesPerMetric = parseInt(numExpectedValuesPerMetric);
        function getTimestampsForQueryResultSet(queryResultSet) {
            return Object.keys(queryResultSet[0].dps);
        }
        var insufficientQueryResultSets = this.queryResultSets.filter(function (queryResultSet) {
            var timestamps = getTimestampsForQueryResultSet(queryResultSet);
            return timestamps.length < numExpectedValuesPerMetric;
        });
        if (insufficientQueryResultSets.length > 0) {
            var errorMessages = insufficientQueryResultSets.map(function (insufficientQueryResultSet) {
                return insufficientQueryResultSet[0].metric
                    + " had only "
                    + getTimestampsForQueryResultSet(insufficientQueryResultSet).length
                    + " metric values";
            });
            throw new Error(errorMessages.join(';'));
        }
    });
    this.Then(/^those values may be incorrect but we are only testing for presence$/, function () { });
};
//# sourceMappingURL=open-tsdb-steps.js.map