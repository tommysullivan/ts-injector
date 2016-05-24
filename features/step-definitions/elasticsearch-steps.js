"use strict";
module.exports = function () {
    this.When(/^I query for logs for service "([^"]*)"$/, function (serviceName) {
        var _this = this;
        var logsQuery = $.clusterUnderTest.newElasticSearchClient()
            .then(function (c) { return c.logsForService(serviceName); })
            .then(function (logsQueryResult) { return _this.logsQueryResult = logsQueryResult; });
        return $.expect(logsQuery).to.eventually.be.fulfilled;
    });
    this.Then(/^I receive a result containing greater than "([^"]*)" entries$/, function (threshold) {
        var logsQueryResult = this.logsQueryResult;
        $.expect(logsQueryResult.numberOfHits).to.be.greaterThan(threshold);
    });
    this.Given(/^the service of interest is "([^"]*)", tracked in elasticsearch as "([^"]*)"$/, function (serviceOfInterest, trackedAs) {
        this.serviceOfInterest = serviceOfInterest;
        this.trackedAs = trackedAs;
    });
    this.Given(/^the log file for the service is located at "([^"]*)"$/, function (logPath) {
        this.logLocation = logPath;
    });
    function getLogWriteRequests(lineCount, lineTemplate, prepareLine) {
        var _this = this;
        return $.clusterUnderTest.nodesHosting(this.serviceOfInterest).map(function (n) {
            return n.executeShellCommand("tail -n 1 " + _this.logLocation)
                .then(function (r) { return r.processResult().stdoutLines().first(); })
                .then(function (originalLine) {
                return $.collections.newListOfSize(lineCount).map(function (lineNumber) {
                    var soughtValue = lineTemplate.replace('{testRunGUID}', $.testRunGUID).replace("{lineNumber}", lineNumber + 1).replace(/-/g, '_');
                    return prepareLine(originalLine, soughtValue);
                }).join("\n");
            })
                .then(function (lines) {
                return n.executeShellCommand("echo " + $.shellEscape([lines]) + " >> " + _this.logLocation);
            });
        });
    }
    this.When(/^I append "([^"]*)" fake log lines containing a string with the following format:$/, function (lineCount, lineTemplate) {
        this.lineTemplate = lineTemplate;
        var logWriteRequests = getLogWriteRequests.call(this, lineCount, lineTemplate, function (originalLine, soughtValue) { return (originalLine + " " + soughtValue); });
        return $.expectAll(logWriteRequests).to.eventually.be.fulfilled;
    });
    this.When(/^for each host running the service, I query for logs containing the above string on that host$/, function () {
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
    });
    this.Then(/^I receive at least "([^"]*)" results per host$/, function (numberExpectedHits) {
        var nodeLogResults = this.nodeLogResults;
        $.assertEmptyList(nodeLogResults.filter(function (r) { return r.numberOfHits < numberExpectedHits; }));
    });
    this.When(/^I append "([^"]*)" fake json log lines containing a message property with the following format:$/, function (lineCount, lineTemplate) {
        this.lineTemplate = lineTemplate;
        var logWriteRequests = getLogWriteRequests.call(this, lineCount, lineTemplate, function (originalLine, soughtValue) {
            var lineAsJSON = JSON.parse(originalLine);
            lineAsJSON.message = soughtValue;
            return JSON.stringify(lineAsJSON);
        });
        return $.expectAll(logWriteRequests).to.eventually.be.fulfilled;
    });
};
//# sourceMappingURL=elasticsearch-steps.js.map