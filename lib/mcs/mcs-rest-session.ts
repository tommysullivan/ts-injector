import IThenable from "../promise/i-thenable";
import MCSDashboardInfo from "./mcs-dashboard-info";
import RestClientAsPromised from "../rest/rest-client-as-promised";
import MCSConfiguration from "./mcs-configuration";
import MCS from "./mcs";
import ITypedJSON from "../typed-json/i-typed-json";
import IErrors from "../errors/i-errors";

export default class MCSRestSession {
    private authedRestClient:RestClientAsPromised;
    private mcsConfiguration:MCSConfiguration;
    private mcs:MCS;
    private typedJSON:ITypedJSON;
    private errors:IErrors;

    constructor(authedRestClient:RestClientAsPromised, mcsConfiguration:MCSConfiguration, mcs:MCS, typedJSON:ITypedJSON, errors:IErrors) {
        this.authedRestClient = authedRestClient;
        this.mcsConfiguration = mcsConfiguration;
        this.mcs = mcs;
        this.typedJSON = typedJSON;
        this.errors = errors;
    }

    dashboardInfo():IThenable<MCSDashboardInfo> {
        return this.authedRestClient.post(this.mcsConfiguration.mcsDashboardInfoPath)
            .then(response=>this.mcs.newMCSDashboardInfo(
                this.typedJSON.newJSONObject(response.jsonBody()))
            );
    }

    applicationLinkFor(applicationName:string):IThenable<string> {
        var applicationInfoPath = this.mcsConfiguration.mcsApplicationLinkPathTemplate
            .replace('{applicationName}', applicationName);
        return this.authedRestClient.post(applicationInfoPath)
            .then(response=>{
                var jsonResponse = this.typedJSON.newJSONObject(response.jsonBody());
                try {
                    return jsonResponse.listOfJSONObjectsNamed('data').first().stringPropertyNamed('url');
                }
                catch(e) {
                    throw this.errors.newErrorWithCause(e, `mcs link json format was bad - ${jsonResponse.toString()}`);
                }
            });
    }
}