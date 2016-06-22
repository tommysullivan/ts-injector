import MCSDashboardInfo from "../mcs/mcs-dashboard-info";
import IList from "../collections/i-list";
import IErrors from "../errors/i-errors";

export default class SpyglassHealthChecker {
    private spyglassHealthCheckServiceNames:IList<string>;
    private errors:IErrors;

    constructor(spyglassHealthCheckServiceNames:IList<string>, errors:IErrors) {
        this.spyglassHealthCheckServiceNames = spyglassHealthCheckServiceNames;
        this.errors = errors;
    }

    unhealthySpyglassServiceNamesAccordingToMCS(mcsDashboardInfo:MCSDashboardInfo):IList<string> {
        return this.spyglassHealthCheckServiceNames.filter(
            serviceName=>this.serviceIsUnhealthy(mcsDashboardInfo, serviceName)
        );
    }

    serviceIsUnhealthy(mcsDashboardInfo:MCSDashboardInfo, serviceName:string):boolean {
        try {
            return !mcsDashboardInfo.services().firstWhere(s=>(`mapr-`+s.name==serviceName)).isHealthy;
        }
        catch(e) {
            return true;
        }
    }
}