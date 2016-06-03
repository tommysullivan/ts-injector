"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var cucumber_tsflow_1 = require("cucumber-tsflow");
var ElasticSearchSteps = (function () {
    function ElasticSearchSteps() {
    }
    ElasticSearchSteps.prototype.getLogWriteRequests = function (lineCount, lineTemplate, prepareLine) {
        var _this = this;
        return $.clusterUnderTest.nodesHosting(this.serviceOfInterest).map(function (n) {
            return n.executeShellCommand("tail -n 1 " + _this.logLocation)
                .then(function (r) { return r.processResult().stdoutLines().first(); })
                .then(function (originalLine) {
                return $.collections.newListOfSize(lineCount).map(function (lineNumber) {
                    var soughtValue = lineTemplate
                        .replace('{testRunGUID}', $.testRunGUID)
                        .replace('{lineNumber}', lineNumber + 1)
                        .replace(/-/g, '_');
                    return prepareLine(originalLine, soughtValue);
                }).join("\n");
            })
                .then(function (linesJoinedIntoSingleString) {
                return n.executeShellCommand("echo " + $.sshAPI.newShellEscaper().shellEscape(linesJoinedIntoSingleString) + " >> " + _this.logLocation);
            });
        });
    };
    ElasticSearchSteps.prototype.queryForServiceLogs = function (serviceName) {
        var _this = this;
        var logsQuery = $.clusterUnderTest.newElasticSearchClient()
            .then(function (c) { return c.logsForService(serviceName); })
            .then(function (logsQueryResult) { return _this.logsQueryResult = logsQueryResult; });
        return $.expect(logsQuery).to.eventually.be.fulfilled;
    };
    ElasticSearchSteps.prototype.verifyResultContainsMinimumNumberOfQueries = function (threshold) {
        var logsQueryResult = this.logsQueryResult;
        $.expect(logsQueryResult.numberOfHits).to.be.greaterThan(parseInt(threshold));
    };
    ElasticSearchSteps.prototype.setServiceOfInterestAndAssociatedESTrackingName = function (serviceOfInterest, trackedAs) {
        this.serviceOfInterest = serviceOfInterest;
        this.trackedAs = trackedAs;
    };
    ElasticSearchSteps.prototype.setLogFileForService = function (logPath) {
        this.logLocation = logPath;
    };
    ElasticSearchSteps.prototype.appendNumberOfFakeLogLinesUsingSuppliedFormat = function (lineCount, lineTemplate) {
        this.lineTemplate = lineTemplate;
        var logWriteRequests = this.getLogWriteRequests.call(this, lineCount, lineTemplate, function (originalLine, soughtValue) { return (originalLine + " " + soughtValue); });
        return $.expectAll(logWriteRequests).to.eventually.be.fulfilled;
    };
    ElasticSearchSteps.prototype.queryLogsForSpecificHostAndIdentifyingString = function () {
        var _this = this;
        var nodeLogRequests = $.clusterUnderTest.newElasticSearchClient()
            .then(function (es) {
            var nodeLogRequests = $.clusterUnderTest.nodesHosting(_this.serviceOfInterest).map(function (n) {
                return n.hostNameAccordingToNode
                    .then(function (hostNameFQDN) {
                    var soughtText = _this.lineTemplate.replace('{testRunGUID}', $.testRunGUID).replace('{lineNumber}', '').replace(/-/g, '_') + "*";
                    return es.logsForServiceThatContainTextOnParticularHost(_this.trackedAs, soughtText, hostNameFQDN);
                });
            });
            return $.promiseFactory.newGroupPromise(nodeLogRequests);
        })
            .then(function (nodeLogResults) { return _this.nodeLogResults = nodeLogResults; });
        return $.expect(nodeLogRequests).to.eventually.be.fulfilled;
    };
    ElasticSearchSteps.prototype.verifyRequisiteNumberOfHitsReceivedPerHost = function (numberExpectedHits) {
        var nodeLogResults = this.nodeLogResults;
        $.expectEmptyList(nodeLogResults.filter(function (r) { return r.numberOfHits < parseInt(numberExpectedHits); }));
    };
    ElasticSearchSteps.prototype.appendFakeLogLines = function (lineCount, lineTemplate) {
        this.lineTemplate = lineTemplate;
        var logWriteRequests = this.getLogWriteRequests.call(lineCount, lineTemplate, function (originalLine, soughtValue) {
            var lineAsJSON = JSON.parse(originalLine);
            lineAsJSON.message = soughtValue;
            return JSON.stringify(lineAsJSON);
        });
        return $.expectAll(logWriteRequests).to.eventually.be.fulfilled;
    };
    ElasticSearchSteps.prototype.runLoadTemplateOnOneESNode = function () {
        var esNode = $.clusterUnderTest.nodesHosting('mapr-elasticsearch').first();
        var nodeIp = esNode.host;
        var result = esNode.executeShellCommand("/opt/mapr/elasticsearch/elasticsearch-2.2.0/bin/es_cluster_mgmt.sh -loadTemplate " + nodeIp);
        return $.expect(result).to.eventually.be.fulfilled;
    };
    __decorate([
        cucumber_tsflow_1.when(/^I query for logs for service "([^"]*)"$/)
    ], ElasticSearchSteps.prototype, "queryForServiceLogs", null);
    __decorate([
        cucumber_tsflow_1.then(/^I receive a result containing greater than "([^"]*)" entries$/)
    ], ElasticSearchSteps.prototype, "verifyResultContainsMinimumNumberOfQueries", null);
    __decorate([
        cucumber_tsflow_1.given(/^the service of interest is "([^"]*)", tracked in elasticsearch as "([^"]*)"$/)
    ], ElasticSearchSteps.prototype, "setServiceOfInterestAndAssociatedESTrackingName", null);
    __decorate([
        cucumber_tsflow_1.given(/^the log file for the service is located at "([^"]*)"$/)
    ], ElasticSearchSteps.prototype, "setLogFileForService", null);
    __decorate([
        cucumber_tsflow_1.when(/^I append "([^"]*)" fake log lines containing a string with the following format:$/)
    ], ElasticSearchSteps.prototype, "appendNumberOfFakeLogLinesUsingSuppliedFormat", null);
    __decorate([
        cucumber_tsflow_1.when(/^for each host running the service, I query for logs containing the above string on that host$/)
    ], ElasticSearchSteps.prototype, "queryLogsForSpecificHostAndIdentifyingString", null);
    __decorate([
        cucumber_tsflow_1.then(/^I receive at least "([^"]*)" results per host$/)
    ], ElasticSearchSteps.prototype, "verifyRequisiteNumberOfHitsReceivedPerHost", null);
    __decorate([
        cucumber_tsflow_1.when(/^I append "([^"]*)" fake json log lines containing a message property with the following format:$/)
    ], ElasticSearchSteps.prototype, "appendFakeLogLines", null);
    __decorate([
        cucumber_tsflow_1.given(/^I run loadTemplate on one of the es nodes$/)
    ], ElasticSearchSteps.prototype, "runLoadTemplateOnOneESNode", null);
    ElasticSearchSteps = __decorate([
        cucumber_tsflow_1.binding()
    ], ElasticSearchSteps);
    return ElasticSearchSteps;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ElasticSearchSteps;
module.exports = ElasticSearchSteps;
//# sourceMappingURL=elasticsearch-steps.js.map