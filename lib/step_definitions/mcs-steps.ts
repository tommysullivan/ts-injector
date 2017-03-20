import {PromisedAssertion} from "../chai-as-promised/promised-assertion";
import {ICucumberStepHelper} from "../clusters/i-cucumber-step-helper";
import {MCSDashboardInfo} from "../mcs/mcs-dashboard-info";
import {IList} from "../collections/i-list";
import {IMCSDashboardInfo} from "../mcs/i-mcs-dashboard-info";
import {IMCSRestSession} from "../mcs/i-mcs-rest-session";

declare const $:ICucumberStepHelper;
declare const module:any;

module.exports = function() {
    let mcsRestSession:IMCSRestSession;
    let mcsDashboardInfo:IMCSDashboardInfo;
    let appLinks:IList<string>;

    this.Before(function () {
        mcsRestSession = undefined;
        mcsDashboardInfo = undefined;
        appLinks = undefined;
    });

    this.Given(/^I have an authenticated MCS Rest Client Session$/, ():PromisedAssertion => {
        const futureMCSSession = $.clusterUnderTest.newAuthedMCSSession()
            .then(mcsSession=> mcsRestSession= mcsSession);
        return $.expect(futureMCSSession).to.eventually.not.be.null;
    });

    this.Given(/^I use the MCS Rest Client Session to retrieve dashboardInfo$/, ():PromisedAssertion => {
        const futureDashboardInfo = mcsRestSession.dashboardInfo
            .then(dashboardInfo => mcsDashboardInfo = dashboardInfo);
        return $.expect(futureDashboardInfo).to.eventually.not.be.null;
    });

    this.When(/^I ask for a link to the following applications:$/, (table:string):PromisedAssertion => {
        const applicationNames = $.cucumber.getListOfStringsFromTable(table);
        const allAppLinks = applicationNames.mapToFutureList(a => mcsRestSession.applicationLinkFor(a))
            .then(allLinks => appLinks = allLinks);
        return $.expect(allAppLinks).to.eventually.be.fulfilled;
    });

    this.Given(/^a GET request of each URL does not return an error status code$/, ():PromisedAssertion => {
        return $.expectAll(
            appLinks.map(
                url=>$.rest.newRestClient().get(url)
            )
        ).to.eventually.be.fulfilled;
    });

    this.When(/^I purposely take down (.*) on one or more nodes$/, (serviceName:string, callback:any):void => {
       callback.pending();
    });

    this.Then(/^I see that (.*) is in the list within "([^"]*)" seconds$/, (serviceName:string, maxTimeToShowUp:string, callback:any):void => {
       callback.pending();
    });

    this.Then(/^all health checkable services are healthy$/, (): PromisedAssertion=> {
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
                return unhealthyOrAbsentServices.toArray();
            });
        return $.expect(futureUnhealthyServices).to.eventually.be.empty;
    });
};