import { binding as steps, given, when, then } from "cucumber-tsflow";
import Framework from "../../lib/framework/framework";
import PromisedAssertion = Chai.PromisedAssertion;
import IList from "../../lib/collections/i-list";
import ISSHResult from "../../lib/ssh/i-ssh-result";
import ElasticSearchResult from "../../lib/elasticsearch/elasticsearch-result";
import IThenable from "../../lib/promise/i-thenable";
declare var $:Framework;
declare var module:any;

@steps()
export default class ElasticSearchSteps {
    private serviceOfInterest:string;
    private trackedAs:string;
    private logsQueryResult:ElasticSearchResult;
    private logLocation:string;
    private lineTemplate:string;
    private nodeLogResults:IList<ElasticSearchResult>;

    private getLogWriteRequests(lineCount:number, lineTemplate:string, prepareLine:(originalLine:string, soughtValue:string) => string):IList<IThenable<ISSHResult>> {
        return $.clusterUnderTest.nodesHosting(this.serviceOfInterest).map(n => {
            return n.executeShellCommand(`tail -n 1 ${this.logLocation}`)
                .then(r => r.processResult().stdoutLines().first())
                .then(originalLine => {
                    return $.collections.newListOfSize(lineCount).map(lineNumber => {
                        var soughtValue = lineTemplate
                            .replace('{testRunGUID}', $.testRunGUID)
                            .replace('{lineNumber}', lineNumber + 1)
                            .replace(/-/g,'_');
                        return prepareLine(originalLine, soughtValue);
                    }).join("\n");
                })
                .then(linesJoinedIntoSingleString=>{
                    return n.executeShellCommand(`echo ${$.sshAPI.newShellEscaper().shellEscape(linesJoinedIntoSingleString)} >> ${this.logLocation}`);
                });
        });
    }

    @when(/^I query for logs for service "([^"]*)"$/)
    queryForServiceLogs(serviceName:string):PromisedAssertion {
        var logsQuery = $.clusterUnderTest.newElasticSearchClient()
            .then(c=>c.logsForService(serviceName))
            .then(logsQueryResult=>this.logsQueryResult=logsQueryResult);
        return $.expect(logsQuery).to.eventually.be.fulfilled;
    }

    @then(/^I receive a result containing greater than "([^"]*)" entries$/)
    verifyResultContainsMinimumNumberOfQueries(threshold:string):void {
        var logsQueryResult:ElasticSearchResult = this.logsQueryResult;
        $.expect(logsQueryResult.numberOfHits).to.be.greaterThan(parseInt(threshold));
    }

    @given(/^the service of interest is "([^"]*)", tracked in elasticsearch as "([^"]*)"$/)
    setServiceOfInterestAndAssociatedESTrackingName(serviceOfInterest:string, trackedAs:string):void {
        this.serviceOfInterest = serviceOfInterest;
        this.trackedAs = trackedAs;
    }

    @given(/^the log file for the service is located at "([^"]*)"$/)
    setLogFileForService(logPath:string):void {
        this.logLocation = logPath;
    }

    @when(/^I append "([^"]*)" fake log lines containing a string with the following format:$/)
    appendNumberOfFakeLogLinesUsingSuppliedFormat(lineCount:string, lineTemplate:string):PromisedAssertion {
        this.lineTemplate = lineTemplate;
        var logWriteRequests = this.getLogWriteRequests.call(this, lineCount, lineTemplate, (originalLine, soughtValue)=>`${originalLine} ${soughtValue}`);
        return $.expectAll(logWriteRequests).to.eventually.be.fulfilled;
    }

    @when(/^for each host running the service, I query for logs containing the above string on that host$/)
    queryLogsForSpecificHostAndIdentifyingString():PromisedAssertion {
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
    }

    @then(/^I receive at least "([^"]*)" results per host$/)
    verifyRequisiteNumberOfHitsReceivedPerHost(numberExpectedHits:string):void {
        var nodeLogResults:IList<ElasticSearchResult> = this.nodeLogResults;
        $.expectEmptyList(nodeLogResults.filter(r=>r.numberOfHits < parseInt(numberExpectedHits)));
    }

    @when(/^I append "([^"]*)" fake json log lines containing a message property with the following format:$/)
    appendFakeLogLines(lineCount, lineTemplate:string):PromisedAssertion {
        this.lineTemplate = lineTemplate;
        var logWriteRequests = this.getLogWriteRequests.call(lineCount, lineTemplate, (originalLine, soughtValue)=>{
            var lineAsJSON = JSON.parse(originalLine);
            lineAsJSON.message = soughtValue;
            return JSON.stringify(lineAsJSON);
        });
        return $.expectAll(logWriteRequests).to.eventually.be.fulfilled;
    }

    @given(/^I run loadTemplate on one of the es nodes$/)
    runLoadTemplateOnOneESNode():PromisedAssertion {
        var esNode = $.clusterUnderTest.nodesHosting('mapr-elasticsearch').first();
        var esVersion = esNode.packages.where(p => p.name == 'mapr-elasticsearch').first().version;
        var nodeIp = esNode.host;
        var result = esNode.executeShellCommand(`/opt/mapr/elasticsearch/elasticsearch-${esVersion}/bin/es_cluster_mgmt.sh -loadTemplate ${nodeIp}`);
        return $.expect(result).to.eventually.be.fulfilled;
    }
}
module.exports = ElasticSearchSteps;