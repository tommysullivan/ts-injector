"use strict";
module.exports = function () {
    this.When(/^I query the ElasticSearch Server for logs for index "([^"]*)"$/, function (indexName) {
        var _this = this;
        var logsRequest = $.clusterUnderTest.newElasticSearchClient()
            .then(function (elasticSearchClient) { return elasticSearchClient.getLogsForIndex(indexName); })
            .then(function (logsForIndex) { return _this.logsForIndex = logsForIndex; });
        return $.expect(logsRequest).to.eventually.be.fulfilled;
    });
    this.Then(/^The result has at least 1 log containing the word "([^"]*)"$/, function (soughtWord) {
        return $.expect(JSON.stringify(this.logsForIndex)).to.contain(soughtWord);
    });
};
//# sourceMappingURL=elasticsearch-steps.js.map