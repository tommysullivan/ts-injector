import Framework from "../../lib/framework/framework";
import MCSRestSession from "../../lib/mcs/mcs-rest-session";
import MCSDashboardInfo from "../../lib/mcs/mcs-dashboard-info";
declare var $:Framework;
declare var module:any;

module.exports = function() {

    function throwError(e) {
        throw new Error(e.toString());
    }

    this.Given(/^I have an authenticated MCS Rest Client Session$/, function () {
        var mcsSessionRequest = $.clusterUnderTest.newAuthedMCSSession()
            .then(mcsSession=>{
                this.mcsSession = mcsSession;
            });
        return $.expect(mcsSessionRequest).to.eventually.be.fulfilled;
    });

    this.Given(/^I use the MCS Rest Client Session to retrieve dashboardInfo$/, function () {
        var mcsSession:MCSRestSession = this.mcsSession;
        var dashboardInfoRequest = mcsSession.dashboardInfo()
            .then(dashboardInfo => this.dashboardInfo = dashboardInfo);
        return $.expect(dashboardInfoRequest).to.eventually.not.be.null;
    });

    this.When(/^I ask the dashboardInfo for unhealthySpyglassServices$/, function () {
        var dashboardInfo = <MCSDashboardInfo>this.dashboardInfo;
        this.unhealthySpyglassServices = $.spyglassHealthChecker.unhealthySpyglassServiceNamesAccordingToMCS(
            dashboardInfo
        );
    });

    this.Then(/^I do not see any unhealthy spyglass services$/, function () {
        $.assertEmptyList(this.unhealthySpyglassServices);
    });

    this.When(/^I ask for a link to the following applications:$/, function (table) {
        var applicationNames = $.cucumber.getArrayFromTable(table);
        var mcsSession:MCSRestSession = this.mcsSession;
        var multiUrlRequest = $.promiseFactory
            .newGroupPromise(
                applicationNames.map(
                    appName => mcsSession.applicationLinkFor(appName)
                )
            )
            .then(appLinks => this.appLinks = appLinks);
        return $.expect(multiUrlRequest).to.be.fulfilled;
    });

    this.Given(/^a GET request of each URL does not return an error status code$/, function () {
        var urlRequestGroup = $.promiseFactory.newGroupPromise(
            this.appLinks.map(url=>$.rest.newRestClientAsPromised().get(url))
        )
        return $.expect(urlRequestGroup).to.eventually.be.fulfilled;
    });

    this.When(/^I purposely take down (.*) on one or more nodes$/, function (service, callback) {
       // Write code here that turns the phrase above into concrete actions
       callback.pending();
    });

    this.Then(/^I see that (.*) is in the list within "([^"]*)" seconds$/, function (arg1, service, callback) {
       // Write code here that turns the phrase above into concrete actions
       callback.pending();
    });

}