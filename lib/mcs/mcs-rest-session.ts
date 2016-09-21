import {IFuture} from "../promise/i-future";
import {ITypedJSON} from "../typed-json/i-typed-json";
import {IErrors} from "../errors/i-errors";
import {IRestClientAsPromised} from "../rest/i-rest-client-as-promised";
import {IMCSConfiguration} from "./i-mcs-configuration";
import {IMCS} from "./i-mcs";
import {IMCSRestSession} from "./i-mcs-rest-session";
import {IMCSDashboardInfo} from "./i-mcs-dashboard-info";

export class MCSRestSession implements IMCSRestSession {

    constructor(
        private authedRestClient:IRestClientAsPromised,
        private mcsConfiguration:IMCSConfiguration,
        private mcs:IMCS,
        private typedJSON:ITypedJSON,
        private errors:IErrors
    ) {}

    get dashboardInfo():IFuture<IMCSDashboardInfo> {
        return this.authedRestClient.post(this.mcsConfiguration.mcsDashboardInfoPath)
            .then(response=>this.mcs.newMCSDashboardInfo(
                this.typedJSON.newJSONObject(response.jsonBody))
            );
    }

    applicationLinkFor(applicationName:string):IFuture<string> {
        const applicationInfoPath = this.mcsConfiguration.mcsApplicationLinkPathTemplate
            .replace('{applicationName}', applicationName);
        return this.authedRestClient.post(applicationInfoPath)
            .then(response=>{
                const jsonResponse = this.typedJSON.newJSONObject(response.jsonBody);
                try {
                    return jsonResponse.listOfJSONObjectsNamed('data').first.stringPropertyNamed('url');
                }
                catch(e) {
                    throw this.errors.newErrorWithCause(e, `mcs link json format was bad - ${jsonResponse.toString()}`);
                }
            });
    }
}