"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var cucumber_tsflow_1 = require("cucumber-tsflow");
var MCSSteps = (function () {
    function MCSSteps() {
    }
    MCSSteps.prototype.throwError = function (e) {
        throw new Error(e.toString());
    };
    MCSSteps.prototype.getAuthenticatedMCSRestClient = function () {
        var _this = this;
        var futureMCSSession = $.clusterUnderTest.newAuthedMCSSession()
            .then(function (mcsSession) { return _this.mcsSession = mcsSession; });
        return $.expect(futureMCSSession).to.eventually.not.be.null;
    };
    MCSSteps.prototype.retrieveDashboardInfo = function () {
        var _this = this;
        var futureDashboardInfo = this.mcsSession.dashboardInfo()
            .then(function (dashboardInfo) { return _this.dashboardInfo = dashboardInfo; });
        return $.expect(futureDashboardInfo).to.eventually.not.be.null;
    };
    MCSSteps.prototype.getUnhealthySpyglassServices = function () {
        this.unhealthySpyglassServices = $.spyglassHealthChecker.unhealthySpyglassServiceNamesAccordingToMCS(this.dashboardInfo);
        $.expect(this.unhealthySpyglassServices).not.to.be.null;
    };
    MCSSteps.prototype.verifyNoUnhealthySpyglassServices = function () {
        $.expectEmptyList(this.unhealthySpyglassServices);
    };
    MCSSteps.prototype.getLinkToRequestedApplications = function (table) {
        var _this = this;
        var applicationNames = $.cucumber.getListOfStringsFromTable(table);
        var futureAppLinks = applicationNames.map(function (a) { return _this.mcsSession.applicationLinkFor(a); });
        var allAppLinks = $.promiseFactory.newGroupPromise(futureAppLinks)
            .then(function (allLinks) { return _this.appLinks = allLinks; });
        return $.expect(allAppLinks).to.eventually.be.fulfilled;
    };
    MCSSteps.prototype.verifyAllLinksAreValidAndWorking = function () {
        return $.expectAll(this.appLinks.map(function (url) { return $.rest.newRestClientAsPromised().get(url); })).to.eventually.be.fulfilled;
    };
    MCSSteps.prototype.purposelyTakeDownNodes = function (serviceName, callback) {
        callback.pending();
    };
    MCSSteps.prototype.verifyServiceIsInUnhealthyServiceListWithin = function (serviceName, maxTimeToShowUp, callback) {
        callback.pending();
    };
    MCSSteps.prototype.verifyAllHealthCheckableServicesAreReportingHealthy = function () {
        var healthCheckableServiceNames = $.packaging.defaultPackageSets.all.firstWhere(function (ps) { return ps.id == 'healthCheckable'; }).packages.map(function (p) { return p.name; });
        var futureUnhealthyServices = $.clusterUnderTest.newAuthedMCSSession()
            .then(function (mcsSession) { return mcsSession.dashboardInfo(); })
            .then(function (dashboardInfo) {
            var unhealthyOrAbsentServices = healthCheckableServiceNames.filter(function (healthCheckableServiceName) {
                var matchingServiceInMCS = dashboardInfo.services().firstWhere(function (mcsService) { return "mapr-" + mcsService.name == healthCheckableServiceName; }, "MCS service named " + healthCheckableServiceName + " was not found");
                return !matchingServiceInMCS.isHealthy;
            });
            return unhealthyOrAbsentServices;
        });
        return $.expect(futureUnhealthyServices).to.eventually.not.be.empty;
    };
    __decorate([
        cucumber_tsflow_1.given(/^I have an authenticated MCS Rest Client Session$/)
    ], MCSSteps.prototype, "getAuthenticatedMCSRestClient", null);
    __decorate([
        cucumber_tsflow_1.given(/^I use the MCS Rest Client Session to retrieve dashboardInfo$/)
    ], MCSSteps.prototype, "retrieveDashboardInfo", null);
    __decorate([
        cucumber_tsflow_1.when(/^I ask the dashboardInfo for unhealthySpyglassServices$/)
    ], MCSSteps.prototype, "getUnhealthySpyglassServices", null);
    __decorate([
        cucumber_tsflow_1.then(/^I do not see any unhealthy spyglass services$/)
    ], MCSSteps.prototype, "verifyNoUnhealthySpyglassServices", null);
    __decorate([
        cucumber_tsflow_1.when(/^I ask for a link to the following applications:$/)
    ], MCSSteps.prototype, "getLinkToRequestedApplications", null);
    __decorate([
        cucumber_tsflow_1.given(/^a GET request of each URL does not return an error status code$/)
    ], MCSSteps.prototype, "verifyAllLinksAreValidAndWorking", null);
    __decorate([
        cucumber_tsflow_1.when(/^I purposely take down (.*) on one or more nodes$/)
    ], MCSSteps.prototype, "purposelyTakeDownNodes", null);
    __decorate([
        cucumber_tsflow_1.then(/^I see that (.*) is in the list within "([^"]*)" seconds$/)
    ], MCSSteps.prototype, "verifyServiceIsInUnhealthyServiceListWithin", null);
    __decorate([
        cucumber_tsflow_1.then(/^all health checkable services are healthy$/)
    ], MCSSteps.prototype, "verifyAllHealthCheckableServicesAreReportingHealthy", null);
    MCSSteps = __decorate([
        cucumber_tsflow_1.binding()
    ], MCSSteps);
    return MCSSteps;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MCSSteps;
module.exports = MCSSteps;
//# sourceMappingURL=mcs-steps.js.map