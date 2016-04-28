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
        var query = {
            "query": {
                "bool": {
                    "must": [
                        {"match": {"service_name": serviceName}},
                        {"match_phrase": {"message": this.appId }}
                    ]
                }
            }
        };
        var hitsRequest = $.clusterUnderTest.newElasticSearchClient()
            .then(es=>es.executeQuery('/mapr_monitoring-*/_search', JSON.stringify(query)))
            .then(r=>{
                console.log(r.body());
                return r.bodyAsJsonObject().jsonObjectNamed('hits').numericPropertyNamed('total')
            });
        return $.expect(hitsRequest).to.eventually.be.greaterThan(0);
    });
}