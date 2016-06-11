import { binding as steps, given, when, then } from "cucumber-tsflow";
import Framework from "../../lib/framework/framework";
import PromisedAssertion = Chai.PromisedAssertion;
import GrafanaRestSession from "../../lib/grafana/grafana-rest-session";
declare var $:Framework;
declare var module:any;

@steps()
export default class GrafanaSteps {
    private grafanaRestSession:GrafanaRestSession;

    @given(/^I have an authenticated grafana rest client$/)
    verifyAuthenticatedGrafanaRestClientExists():PromisedAssertion {
        return $.expect(
            $.grafana.newGrafanaRestClient().createAutheticatedSessionWithDefaultCredentials()
                .then(grafanaRestSession => this.grafanaRestSession = grafanaRestSession)
        ).to.eventually.be.fulfilled;
    }
    
    @when(/^I request to import the following dashboard definitions:$/)
    requestDashboardDefinitionImports(table:string):PromisedAssertion {
        var dashboardNames = $.cucumber.getListOfStringsFromTable(table);
        var fqdns = $.clusterUnderTest.nodes().map(n=>n.host);
        var uploadPromises = dashboardNames.map(dashboardName => this.grafanaRestSession.uploadGrafanaDashboard(dashboardName, fqdns));
        return $.expectAll(uploadPromises).to.eventually.be.fulfilled;
    }
    
    @then(/^the reports are all available to view$/)
    validateReportsAreAvailableToView(callback:any):void {
        callback.pending();
    }
}
module.exports = GrafanaSteps;