"use strict";
module.exports = function () {
    this.Given(/^I have updated the package manager$/, function () {
        var result = $.promiseFactory.newGroupPromise($.clusterUnderTest.nodes().map(function (n) { return n.executeShellCommand(n.repo.packageUpdateCommand); }));
        return $.expect(result).to.eventually.be.fulfilled;
    });
    this.When(/^I install the Core components$/, { timeout: 1000 * 60 * 20 }, function () {
        var commandPromises = $.clusterUnderTest.nodes().map(function (n) {
            var coreServices = $.versioning.serviceSet().filter(function (s) { return n.isHostingService(s.name) && s.isCore; });
            var command = n.repo.packageCommand + " install -y " + coreServices.map(function (s) { return s.name; }).join(' ');
            return n.executeShellCommand(command);
        });
        var result = $.promiseFactory.newGroupPromise(commandPromises);
        return $.expect(result).to.eventually.be.fulfilled;
    });
    this.Given(/^I install all spyglass components$/, { timeout: 1000 * 60 * 20 }, function () {
        var commandPromises = $.clusterUnderTest.nodes().map(function (n) {
            var spyglassServices = $.versioning.serviceSet().filter(function (s) { return n.isHostingService(s.name) && !s.isCore; });
            var command = n.repo.packageCommand + " install -y " + spyglassServices.map(function (s) { return s.name; }).join(' ');
            return n.executeShellCommand(command);
        });
        var result = $.promiseFactory.newGroupPromise(commandPromises);
        return $.expect(result).to.eventually.be.fulfilled;
    });
    this.Then(/^all health checkable services are healthy$/, function () {
        var healthCheckableServices = $.versioning.serviceSet()
            .filter(function (s) { return s.isHealthCheckable && $.clusterUnderTest.nodesHosting(s.name).notEmpty(); });
        var unhealthyServicesRequest = $.clusterUnderTest.newAuthedMCSSession()
            .then(function (mcsSession) { return mcsSession.dashboardInfo(); })
            .then(function (dashboardInfo) {
            var unhealthyOrAbsentServices = healthCheckableServices.filter(function (healthCheckableService) {
                var matchingServiceInMCS = dashboardInfo.services().firstWhere(function (mcsService) { return "mapr-" + mcsService.name == healthCheckableService.name; }, "MCS service named " + healthCheckableService.name + " was not found");
                return !matchingServiceInMCS.isHealthy;
            });
            return unhealthyOrAbsentServices;
        });
        unhealthyServicesRequest.then(function (u) { return console.log(u.toJSONString()); });
        return $.expect(unhealthyServicesRequest.then(function (a) { return a.toArray(); })).to.eventually.be.empty;
    });
};
//# sourceMappingURL=package-manager-installation-steps.js.map