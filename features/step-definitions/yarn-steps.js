"use strict";
module.exports = function () {
    this.When(/^I obtain the application id from the stdout$/, function () {
        var lastCommandResultSet = this.lastCommandResultSet;
        var lineContainingAppId = lastCommandResultSet.last.processResult().stderrLines().firstWhere(function (l) { return l.indexOf('Submitted application') > -1; });
        var lineParts = lineContainingAppId.split(' ');
        var appId = lineParts[lineParts.length - 1];
        $.expect(appId).is.not.null;
        console.log(appId);
        this.appId = appId;
    });
    this.Then(/^I should see logs in ElasticSearch containing the application ID when I filter by service name "([^"]*)"$/, function (serviceName) {
        var _this = this;
        var hitsRequest = $.clusterUnderTest.newElasticSearchClient()
            .then(function (es) { return es.logsForServiceThatContainText(serviceName, _this.appId); })
            .then(function (result) { return result.numberOfHits; });
        return $.expect(hitsRequest).to.eventually.be.greaterThan(0);
    });
};
//# sourceMappingURL=yarn-steps.js.map