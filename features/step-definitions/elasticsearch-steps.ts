import Framework from "../../lib/framework/framework";
import ElasticSearchResult from "../../lib/elasticsearch/elasticsearch-result";
import IList from "../../lib/collections/i-list";

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

    this.Given(/^the service of interest is "([^"]*)"$/, function (serviceOfInterest) {
        this.serviceOfInterest = serviceOfInterest;
    });

    this.Given(/^the log file for the service is located at "([^"]*)"$/, function (logPath) {
        this.logLocation = logPath;
    });

    this.When(/^I append "([^"]*)" fake log lines containing a string with the following format:$/, function (lineCount, lineTemplate:string) {
        this.lineTemplate = lineTemplate;
        var logWriteRequests = $.clusterUnderTest.nodesHosting(this.serviceOfInterest).map(n => {
            return n.executeShellCommand(`tail -n 1 ${this.logLocation}`)
                .then(r => r.processResult().stdoutLines().first())
                .then(line => {
                    return $.collections.newListOfSize(lineCount).map(lineNumber => {
                        return line + lineTemplate.replace('{testRunGUID}', $.testRunGUID).replace(`{lineNumber}`, lineNumber + 1)
                    }).join("\n");
                })
                .then(lines=>{
                    var commandParts = ['echo', lines, '>>', this.logLocation];
                    return n.executeShellCommand($.shellEscape(commandParts));
                });
        });
        return $.expectAll(logWriteRequests).to.eventually.be.fulfilled;
    });

    this.When(/^for each host running the service, I query for logs containing the above string on that host$/, function () {
        var nodeLogRequests = $.clusterUnderTest.newElasticSearchClient()
            .then(es=> {
                var nodeLogRequests = $.clusterUnderTest.nodesHosting(this.serviceOfInterest).map(n=>{
                    return n.hostNameAccordingToNode
                        .then(hostNameFQDN=>{
                            var soughtText = this.lineTemplate.replace('{testRunGUID}', $.testRunGUID).replace('{lineNumber}', '');
                            return es.logsForServiceThatContainTextOnParticularHost(this.serviceOfInterest, soughtText, hostNameFQDN)
                        });
                });
                return $.promiseFactory.newGroupPromise(nodeLogRequests);
            })
            .then(nodeLogResults => this.nodeLogResults = nodeLogResults);
        $.expect(nodeLogRequests).to.eventually.be.fulfilled;
    });

    this.Then(/^I receive "([^"]*)" results per host$/, function (numberExpectedHits) {
        var nodeLogResults:IList<ElasticSearchResult> = this.nodeLogResults;
        $.assertEmptyList(nodeLogResults.filter(r=>r.numberOfHits==numberExpectedHits));
    });

}