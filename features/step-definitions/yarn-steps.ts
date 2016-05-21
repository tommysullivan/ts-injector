import Framework from "../../lib/framework/framework";
import IList from "../../lib/collections/i-list";
import ISSHResult from "../../lib/ssh/i-ssh-result";

declare var $:Framework;
declare var module:any;

module.exports = function() {
    this.When(/^I obtain the application id from the stdout$/, function () {
        var lastCommandResultSet:IList<ISSHResult> = this.lastCommandResultSet;
        var lineContainingAppId = lastCommandResultSet.last.processResult().stderrLines().firstWhere(l=>l.indexOf('Submitted application')>-1);
        var lineParts = lineContainingAppId.split(' ');
        var appId = lineParts[lineParts.length-1];
        $.expect(appId).is.not.null;
        console.log(appId);
        this.appId = appId;
    });

    this.Then(/^I should see logs in ElasticSearch containing the application ID when I filter by service name "([^"]*)"$/, function (serviceName) {
        var hitsRequest = $.clusterUnderTest.newElasticSearchClient()
            .then(es=>es.logsForServiceThatContainText(serviceName, this.appId))
            .then(result=>result.numberOfHits);
        return $.expect(hitsRequest).to.eventually.be.greaterThan(0);
    });
}