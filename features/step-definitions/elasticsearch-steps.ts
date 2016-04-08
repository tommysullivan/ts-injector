import Framework from "../../lib/framework/framework";
declare var $:Framework;
declare var module:any;

module.exports = function() {
    this.When(/^I query the ElasticSearch Server for logs for index "([^"]*)"$/, function (indexName) {
        var logsRequest = $.clusterUnderTest.newElasticSearchClient()
            .then(elasticSearchClient=>elasticSearchClient.getLogsForIndex(indexName))
            .then(logsForIndex=>this.logsForIndex = logsForIndex);
        return $.expect(logsRequest).to.eventually.be.fulfilled;
    });

    this.Then(/^The result has at least 1 log containing the word "([^"]*)"$/, function (soughtWord) {
        return $.expect(JSON.stringify(this.logsForIndex)).to.contain(soughtWord);
    });
}