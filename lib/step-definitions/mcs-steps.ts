import { binding as steps, given, when, then } from "cucumber-tsflow";
import {PromisedAssertion} from "../chai-as-promised/promised-assertion";
import {Framework} from "../framework/framework";
import {MCSDashboardInfo} from "../mcs/mcs-dashboard-info";
import {IList} from "../collections/i-list";
import {IMCSDashboardInfo} from "../mcs/i-mcs-dashboard-info";
import {IMCSRestSession} from "../mcs/i-mcs-rest-session";

declare const $:Framework;
declare const module:any;

@steps()
export class MCSSteps {
    private mcsSession:IMCSRestSession;
    private dashboardInfo:IMCSDashboardInfo;
    private appLinks:IList<string>;

    @given(/^I have an authenticated MCS Rest Client Session$/)
    getAuthenticatedMCSRestClient():PromisedAssertion {
        const futureMCSSession = $.clusterUnderTest.newAuthedMCSSession()
            .then(mcsSession=>this.mcsSession = mcsSession);
        return $.expect(futureMCSSession).to.eventually.not.be.null;
    }

    @given(/^I use the MCS Rest Client Session to retrieve dashboardInfo$/)
    retrieveDashboardInfo():PromisedAssertion {
        const futureDashboardInfo = this.mcsSession.dashboardInfo
            .then(dashboardInfo => this.dashboardInfo = dashboardInfo);
        return $.expect(futureDashboardInfo).to.eventually.not.be.null;
    }

    @when(/^I ask for a link to the following applications:$/)
    getLinkToRequestedApplications(table):PromisedAssertion {
        const applicationNames = $.cucumber.getListOfStringsFromTable(table);
        const allAppLinks = applicationNames.mapToFutureList(a => this.mcsSession.applicationLinkFor(a))
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
        const healthCheckableServiceNames = $.packaging.defaultPackageSets.all.firstWhere(ps=>ps.id=='healthCheckable').packages.map(p=>p.name);
        const healthCheckableInstalledServiceNames = healthCheckableServiceNames.filter(serviceName => $.clusterUnderTest.isHostingService(serviceName));
        const futureUnhealthyServices = $.clusterUnderTest.newAuthedMCSSession()
            .then(mcsSession=>mcsSession.dashboardInfo)
            .then((dashboardInfo:MCSDashboardInfo)=>{
                const unhealthyOrAbsentServices = healthCheckableInstalledServiceNames.filter(healthCheckableServiceName=>{
                    const matchingServiceInMCS = dashboardInfo.services.firstOrThrow(
                        mcsService=>`mapr-${mcsService.name}`==healthCheckableServiceName,
                        () => new Error(`MCS service named ${healthCheckableServiceName} was not found`)
                    );
                    return !matchingServiceInMCS.isHealthy;
                });
                return unhealthyOrAbsentServices;
            });
        return $.expect(futureUnhealthyServices).to.eventually.not.be.empty;
    }
}
module.exports = MCSSteps;