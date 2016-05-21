import Framework from "../../lib/framework/framework";
import ElasticSearchResult from "../../lib/elasticsearch/elasticsearch-result";
declare var $:Framework;
declare var module:any;

module.exports = function() {

    this.When(/^I query for logs for service "([^"]*)"$/, function (serviceName) {
        var logsQuery = $.clusterUnderTest.newElasticSearchClient()
            .then(c=>c.logsForService(serviceName))
            .then(logsQueryResult=>this.logsQueryResult=logsQueryResult);
        return $.expect(logsQuery).to.eventually.be.fulfilled;
    });

    this.Then(/^I receive a result containing greater than "([^"]*)" entries$/, function (threshold) {
        var logsQueryResult:ElasticSearchResult = this.logsQueryResult;
        $.expect(logsQueryResult.numberOfHits).to.be.greaterThan(threshold);
    });

}