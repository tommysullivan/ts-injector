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

    this.Given(/^the service of interest is "([^"]*)", tracked in elasticsearch as "([^"]*)"$/, function (serviceOfInterest, trackedAs) {
        this.serviceOfInterest = serviceOfInterest;
        this.trackedAs = trackedAs;
    });

    this.Given(/^the log file for the service is located at "([^"]*)"$/, function (logPath) {
        this.logLocation = logPath;
    });

    function getLogWriteRequests(lineCount:number, lineTemplate:string, prepareLine:(originalLine:string, soughtValue:string) => string) {
        return $.clusterUnderTest.nodesHosting(this.serviceOfInterest).map(n => {
            return n.executeShellCommand(`tail -n 1 ${this.logLocation}`)
                .then(r => r.processResult().stdoutLines().first())
                .then(originalLine => {
                    return $.collections.newListOfSize(lineCount).map(lineNumber => {
                        var soughtValue = lineTemplate.replace('{testRunGUID}', $.testRunGUID).replace(`{lineNumber}`, lineNumber + 1).replace(/-/g,'_');
                        return prepareLine(originalLine, soughtValue);
                    }).join("\n");
                })
                .then(lines=>{
                    return n.executeShellCommand(`echo ${$.shellEscape([lines])} >> ${this.logLocation}`);
                });
        });
    }

    this.When(/^I append "([^"]*)" fake log lines containing a string with the following format:$/, function (lineCount, lineTemplate:string) {
        this.lineTemplate = lineTemplate;
        var logWriteRequests = getLogWriteRequests.call(this, lineCount, lineTemplate, (originalLine, soughtValue)=>`${originalLine} ${soughtValue}`);
        return $.expectAll(logWriteRequests).to.eventually.be.fulfilled;
    });

    this.When(/^for each host running the service, I query for logs containing the above string on that host$/, function () {
        var nodeLogRequests = $.clusterUnderTest.newElasticSearchClient()
            .then(es=> {
                var nodeLogRequests = $.clusterUnderTest.nodesHosting(this.serviceOfInterest).map(n=>{
                    return n.hostNameAccordingToNode
                        .then(hostNameFQDN=>{
                            var soughtText = this.lineTemplate.replace('{testRunGUID}', $.testRunGUID).replace('{lineNumber}', '').replace(/-/g,'_') + "*";
                            return es.logsForServiceThatContainTextOnParticularHost(this.trackedAs, soughtText, hostNameFQDN)
                        });
                });
                return $.promiseFactory.newGroupPromise(nodeLogRequests);
            })
            .then(nodeLogResults => this.nodeLogResults = nodeLogResults);
        return $.expect(nodeLogRequests).to.eventually.be.fulfilled;
    });

    this.Then(/^I receive at least "([^"]*)" results per host$/, function (numberExpectedHits) {
        var nodeLogResults:IList<ElasticSearchResult> = this.nodeLogResults;
        $.assertEmptyList(nodeLogResults.filter(r=>r.numberOfHits<numberExpectedHits));
    });

    this.When(/^I append "([^"]*)" fake json log lines containing a message property with the following format:$/, function (lineCount, lineTemplate:string) {
        this.lineTemplate = lineTemplate;
        var logWriteRequests = getLogWriteRequests.call(this, lineCount, lineTemplate, (originalLine, soughtValue)=>{
            var lineAsJSON = JSON.parse(originalLine);
            lineAsJSON.message = soughtValue;
            return JSON.stringify(lineAsJSON);
        });
        return $.expectAll(logWriteRequests).to.eventually.be.fulfilled;
    });

}