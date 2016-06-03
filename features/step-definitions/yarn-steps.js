"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var cucumber_tsflow_1 = require("cucumber-tsflow");
var YarnSteps = (function () {
    function YarnSteps() {
    }
    YarnSteps.prototype.obtainApplicationIdFromStdout = function () {
        var lineContainingAppId = this.lastCommandResultSet.last.processResult().stderrLines().firstWhere(function (l) { return l.indexOf('Submitted application') > -1; });
        var lineParts = lineContainingAppId.split(' ');
        var appId = lineParts[lineParts.length - 1];
        console.log(appId);
        this.appId = appId;
        $.expect(appId).is.not.null;
    };
    YarnSteps.prototype.verifyLogsInElasticSearchContainAppIdWhenFilteringByServiceName = function (serviceName) {
        var _this = this;
        var hitsRequest = $.clusterUnderTest.newElasticSearchClient()
            .then(function (es) { return es.logsForServiceThatContainText(serviceName, _this.appId); })
            .then(function (result) { return result.numberOfHits; });
        return $.expect(hitsRequest).to.eventually.be.greaterThan(0);
    };
    YarnSteps.prototype.verifyClusterMapReduceDefaultModeIsYARN = function () {
        var result = $.clusterUnderTest.nodes().first().newSSHSession()
            .then(function (sshSession) { return sshSession.executeCommand('/opt/mapr/bin/maprcli cluster mapreduce get -json'); })
            .then(function (commandResult) {
            var jsonString = commandResult.processResult().stdoutLines().join("");
            var json = JSON.parse(jsonString);
            return json.data[0].default_mode;
        });
        return $.expect(result).to.eventually.equal('yarn');
    };
    __decorate([
        cucumber_tsflow_1.when(/^I obtain the application id from the stdout$/)
    ], YarnSteps.prototype, "obtainApplicationIdFromStdout", null);
    __decorate([
        cucumber_tsflow_1.then(/^I should see logs in ElasticSearch containing the application ID when I filter by service name "([^"]*)"$/)
    ], YarnSteps.prototype, "verifyLogsInElasticSearchContainAppIdWhenFilteringByServiceName", null);
    __decorate([
        cucumber_tsflow_1.given(/^the cluster is running YARN$/)
    ], YarnSteps.prototype, "verifyClusterMapReduceDefaultModeIsYARN", null);
    YarnSteps = __decorate([
        cucumber_tsflow_1.binding()
    ], YarnSteps);
    return YarnSteps;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = YarnSteps;
module.exports = YarnSteps;
//# sourceMappingURL=yarn-steps.js.map