import {IList} from "../collections/i-list";
import {IJSONObject} from "../typed-json/i-json-object";
import {IMCSDashboardInfo} from "./i-mcs-dashboard-info";
import {IMCS} from "./i-mcs";
import {IMCSServiceInfo} from "./i-mcs-service-info";

export class MCSDashboardInfo implements IMCSDashboardInfo {
    constructor(
        private dashboardInfoJSONObject:IJSONObject,
        private mcs:IMCS
    ) {}

    get services():IList<IMCSServiceInfo> {
        const dataJSONObject = this.dashboardInfoJSONObject.listOfJSONObjectsNamed('data').first;
        const servicesDictionary = dataJSONObject.dictionaryNamed('services');
        return servicesDictionary.keys.map(serviceName=>this.mcs.newMCSServiceInfo(
            serviceName,
            dataJSONObject.jsonObjectNamed('services').jsonObjectNamed(serviceName)
        ));
    }

    toJSON():any { return this.dashboardInfoJSONObject.toJSON(); }
    toString():string { return this.dashboardInfoJSONObject.toString(); }
}