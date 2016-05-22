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
    this.Given(/^the service of interest is "([^"]*)"$/, function (serviceOfInterest) {
        this.serviceOfInterest = serviceOfInterest;
    });
    this.Given(/^the log file for the service is located at "([^"]*)"$/, function (logPath) {
        this.logLocation = logPath;
    });
    this.When(/^I append "([^"]*)" fake log lines containing a string with the following format:$/, function (lineCount, lineTemplate) {
        var _this = this;
        this.lineTemplate = lineTemplate;
        var logWriteRequests = $.clusterUnderTest.nodesHosting(this.serviceOfInterest).map(function (n) {
            return n.executeShellCommand("tail -n 1 " + _this.logLocation)
                .then(function (r) { return r.processResult().stdoutLines().first(); })
                .then(function (line) {
                return $.collections.newListOfSize(lineCount).map(function (lineNumber) {
                    return line + lineTemplate.replace('{testRunGUID}', $.testRunGUID).replace("{lineNumber}", lineNumber + 1);
                }).join("\n");
            })
                .then(function (lines) {
                var commandParts = ['echo', lines, '>>', _this.logLocation];
                return n.executeShellCommand($.shellEscape(commandParts));
            });
        });
        return $.expectAll(logWriteRequests).to.eventually.be.fulfilled;
    });
    this.When(/^for each host running the service, I query for logs containing the above string on that host$/, function () {
        var _this = this;
        var nodeLogRequests = $.clusterUnderTest.newElasticSearchClient()
            .then(function (es) {
            var nodeLogRequests = $.clusterUnderTest.nodesHosting(_this.serviceOfInterest).map(function (n) {
                return n.hostNameAccordingToNode
                    .then(function (hostNameFQDN) {
                    var soughtText = _this.lineTemplate.replace('{testRunGUID}', $.testRunGUID).replace('{lineNumber}', '');
                    return es.logsForServiceThatContainTextOnParticularHost(_this.serviceOfInterest, soughtText, hostNameFQDN);
                });
            });
            return $.promiseFactory.newGroupPromise(nodeLogRequests);
        })
            .then(function (nodeLogResults) { return _this.nodeLogResults = nodeLogResults; });
        $.expect(nodeLogRequests).to.eventually.be.fulfilled;
    });
    this.Then(/^I receive "([^"]*)" results per host$/, function (numberExpectedHits) {
        var nodeLogResults = this.nodeLogResults;
        $.assertEmptyList(nodeLogResults.filter(function (r) { return r.numberOfHits == numberExpectedHits; }));
    });
};
//# sourceMappingURL=elasticsearch-steps.js.map