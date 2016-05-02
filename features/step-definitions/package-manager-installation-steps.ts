import Framework from "../../lib/framework/framework";
import MCSDashboardInfo from "../../lib/mcs/mcs-dashboard-info";
declare var $:Framework;
declare var module:any;

module.exports = function() {
    this.Given(/^I have updated the package manager$/, function () {
        var result = $.promiseFactory.newGroupPromise(
            $.clusterUnderTest.nodes().map(n=>n.executeShellCommand(n.repo.packageUpdateCommand))
        );
        return $.expect(result).to.eventually.be.fulfilled;
    });

    this.When(/^I install the Core components$/, { timeout: 1000 * 60 * 20 }, function () {
        var commandPromises = $.clusterUnderTest.nodes().map(n=>{
            var coreServices = $.versioning.serviceSet().filter(s=>n.isHostingService(s.name) && s.isCore);
            var command = `${n.repo.packageCommand} install -y ${coreServices.map(s=>s.name).join(' ')}`;
            return n.executeShellCommand(command);
        });
        var result = $.promiseFactory.newGroupPromise(commandPromises);
        return $.expect(result).to.eventually.be.fulfilled;
    });

    this.Given(/^I install all spyglass components$/, { timeout: 1000 * 60 * 20 }, function () {
        var commandPromises = $.clusterUnderTest.nodes().map(n=>{
            var spyglassServices = $.versioning.serviceSet().filter(s=>n.isHostingService(s.name) && !s.isCore);
            var command = `${n.repo.packageCommand} install -y ${spyglassServices.map(s=>s.name).join(' ')}`;
            return n.executeShellCommand(command);
        });
        var result = $.promiseFactory.newGroupPromise(commandPromises);
        return $.expect(result).to.eventually.be.fulfilled;
    });

    this.Then(/^all health checkable services are healthy$/, function () {
        var healthCheckableServices = $.versioning.serviceSet()
            .filter(s=>s.isHealthCheckable && $.clusterUnderTest.nodesHosting(s.name).notEmpty());

        var unhealthyServicesRequest = $.clusterUnderTest.newAuthedMCSSession()
            .then(mcsSession=>mcsSession.dashboardInfo())
            .then((dashboardInfo:MCSDashboardInfo)=>{
                var unhealthyOrAbsentServices = healthCheckableServices.filter(healthCheckableService=>{
                    var matchingServiceInMCS = dashboardInfo.services().firstWhere(
                        mcsService=>`mapr-${mcsService.name}`==healthCheckableService.name,
                        `MCS service named ${healthCheckableService.name} was not found`
                    );
                    return !matchingServiceInMCS.isHealthy;
                });
                return unhealthyOrAbsentServices;
            });
        unhealthyServicesRequest.then(u=>console.log(u.toJSONString()));
        return $.expect(unhealthyServicesRequest.then(a=>a.toArray())).to.eventually.be.empty;
    });

}
