import {IFuture} from "../futures/i-future";
import {ITypedJSON} from "../typed-json/i-typed-json";
import {IErrors} from "../errors/i-errors";
import {IRestClient} from "../rest/common/i-rest-client";
import {IMCSConfiguration} from "./i-mcs-configuration";
import {IMCS} from "./i-mcs";
import {IMCSRestSession} from "./i-mcs-rest-session";
import {IMCSDashboardInfo} from "./i-mcs-dashboard-info";
import {IList} from "../collections/i-list";
import {IMCSNodeInfo} from "./i-mcs-node-info";
import {MCSNodeInfo} from "./mcs-node-info";

export class MCSRestSession implements IMCSRestSession {

    constructor(
        private authedRestClient:IRestClient,
        private mcsConfiguration:IMCSConfiguration,
        private mcs:IMCS,
        private typedJSON:ITypedJSON,
        private errors:IErrors
    ) {}

    get dashboardInfo():IFuture<IMCSDashboardInfo> {
        return this.authedRestClient.post(this.mcsConfiguration.mcsDashboardInfoPath)
            .then(response=>this.mcs.newMCSDashboardInfo(
                this.typedJSON.newJSONObject(response.jsonHash))
            );
    }

    applicationLinkFor(applicationName:string):IFuture<string> {
        const applicationInfoPath = this.mcsConfiguration.mcsApplicationLinkPathTemplate
            .replace('{applicationName}', applicationName);
        return this.authedRestClient.post(applicationInfoPath)
            .then(response=>{
                const jsonResponse = this.typedJSON.newJSONObject(response.jsonHash);
                try {
                    return jsonResponse.listOfJSONObjectsNamed('data').first.stringPropertyNamed('url');
                }
                catch(e) {
                    throw this.errors.newErrorWithCause(e, `mcs link json format was bad - ${jsonResponse.toString()}`);
                }
            });
    }

    get nodeList(): IFuture<IList<IMCSNodeInfo>> {
        return this.authedRestClient.post(`/api/node/list`)
            .then(response => this.typedJSON.newJSONObject(response.jsonHash).listOfJSONObjectsNamed(`data`).map(nodeData => new MCSNodeInfo(nodeData)));
    }
}