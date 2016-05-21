"use strict";
module.exports = function () {
    this.When(/^I query for logs for service "([^"]*)"$/, function (serviceName) {
        var _this = this;
        var logsQuery = $.clusterUnderTest.newElasticSearchClient()
            .then(function (c) { return c.logsForService(serviceName); })
            .then(function (logsQueryResult) { return _this.logsQueryResult = logsQueryResult; });
        return $.expect(logsQuery).to.eventually.be.fulfilled;
    });
    this.Then(/^I receive a result containing greater than "([^"]*)" entries$/, function (threshold) {
        var logsQueryResult = this.logsQueryResult;
        $.expect(logsQueryResult.numberOfHits).to.be.greaterThan(threshold);
    });
};
//# sourceMappingURL=elasticsearch-steps.js.map