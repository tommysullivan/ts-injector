import { binding as steps, given, when, then } from "cucumber-tsflow";
import Framework from "../../lib/framework/framework";
import PromisedAssertion = Chai.PromisedAssertion;
import MCSRestSession from "../../lib/mcs/mcs-rest-session";
import MCSDashboardInfo from "../../lib/mcs/mcs-dashboard-info";
import IList from "../../lib/collections/i-list";
declare var $:Framework;
declare var module:any;

@steps()
export default class MCSSteps {
    private mcsSession:MCSRestSession;
    private dashboardInfo:MCSDashboardInfo;
    private unhealthySpyglassServices:IList<string>;
    private appLinks:IList<string>;

    private throwError(e):void {
        throw new Error(e.toString());
    }

    @given(/^I have an authenticated MCS Rest Client Session$/)
    getAuthenticatedMCSRestClient():PromisedAssertion {
        var futureMCSSession = $.clusterUnderTest.newAuthedMCSSession()
            .then(mcsSession=>this.mcsSession = mcsSession);
        return $.expect(futureMCSSession).to.eventually.not.be.null;
    }

    @given(/^I use the MCS Rest Client Session to retrieve dashboardInfo$/)
    retrieveDashboardInfo():PromisedAssertion {
        var futureDashboardInfo = this.mcsSession.dashboardInfo()
            .then(dashboardInfo => this.dashboardInfo = dashboardInfo);
        return $.expect(futureDashboardInfo).to.eventually.not.be.null;
    }

    @when(/^I ask the dashboardInfo for unhealthySpyglassServices$/)
    getUnhealthySpyglassServices():void {
        this.unhealthySpyglassServices = $.spyglassHealthChecker.unhealthySpyglassServiceNamesAccordingToMCS(
            this.dashboardInfo
        );
        $.expect(this.unhealthySpyglassServices).not.to.be.null;
    }

    @then(/^I do not see any unhealthy spyglass services$/)
    verifyNoUnhealthySpyglassServices():void {
        $.expectEmptyList(this.unhealthySpyglassServices);
    }

    @when(/^I ask for a link to the following applications:$/)
    getLinkToRequestedApplications(table):PromisedAssertion {
        var applicationNames = $.cucumber.getListOfStringsFromTable(table);
        var futureAppLinks = applicationNames.map(a => this.mcsSession.applicationLinkFor(a));
        var allAppLinks = $.promiseFactory.newGroupPromise(futureAppLinks)
            .then(allLinks => this.appLinks = allLinks);
        return $.expect(allAppLinks).to.eventually.be.fulfilled;
    }

    @given(/^a GET request of each URL does not return an error status code$/)
    verifyAllLinksAreValidAndWorking():PromisedAssertion {
        return $.expectAll(
            this.appLinks.map(
                url=>$.rest.newRestClientAsPromised().get(url)
            )
        ).to.eventually.be.fulfilled;
    }

    @when(/^I purposely take down (.*) on one or more nodes$/)
    purposelyTakeDownNodes(serviceName:string, callback:any):void {
       callback.pending();
    }

    @then(/^I see that (.*) is in the list within "([^"]*)" seconds$/)
    verifyServiceIsInUnhealthyServiceListWithin(serviceName:string, maxTimeToShowUp:string, callback:any):void {
       callback.pending();
    }

    @then(/^all health checkable services are healthy$/)
    verifyAllHealthCheckableServicesAreReportingHealthy():PromisedAssertion {
        var healthCheckableServiceNames = $.packaging.defaultPackageSets.all.firstWhere(ps=>ps.id=='healthCheckable').packages.map(p=>p.name);
        var futureUnhealthyServices = $.clusterUnderTest.newAuthedMCSSession()
            .then(mcsSession=>mcsSession.dashboardInfo())
            .then((dashboardInfo:MCSDashboardInfo)=>{
                var unhealthyOrAbsentServices = healthCheckableServiceNames.filter(healthCheckableServiceName=>{
                    var matchingServiceInMCS = dashboardInfo.services().firstWhere(
                        mcsService=>`mapr-${mcsService.name}`==healthCheckableServiceName,
                        `MCS service named ${healthCheckableServiceName} was not found`
                    );
                    return !matchingServiceInMCS.isHealthy;
                });
                return unhealthyOrAbsentServices;
            });
        return $.expect(futureUnhealthyServices).to.eventually.not.be.empty;
    }
}
module.exports = MCSSteps;