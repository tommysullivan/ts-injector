import IList from "../collections/i-list";
import IJSONObject from "../typed-json/i-json-object";
import MCS from "./mcs";
import MCSServiceInfo from "./mcs-service-info";

export default class MCSDashboardInfo {
    private dashboardInfoJSONObject:IJSONObject;
    private mcs:MCS;

    constructor(dashboardInfoJSONObject:IJSONObject, mcs:MCS) {
        this.dashboardInfoJSONObject = dashboardInfoJSONObject;
        this.mcs = mcs;
    }

    services():IList<MCSServiceInfo> {
        var dataJSONObject = this.dashboardInfoJSONObject.listOfJSONObjectsNamed('data').first();
        var servicesDictionary = dataJSONObject.dictionaryNamed('services');
        return servicesDictionary.keys.map(serviceName=>this.mcs.newMCSServiceInfo(
            serviceName,
            dataJSONObject.jsonObjectNamed('services').jsonObjectNamed(serviceName)
        ));
    }

    toJSON():any { return this.dashboardInfoJSONObject.toRawJSON(); }
    toString():string { return this.dashboardInfoJSONObject.toString(); }
}