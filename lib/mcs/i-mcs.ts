import {IMCSRestClient} from "./i-mcs-rest-client";
import {IMCSRestSession} from "./i-mcs-rest-session";
import {IRestClientAsPromised} from "../rest/i-rest-client-as-promised";
import {IMCSDashboardInfo} from "./i-mcs-dashboard-info";
import {IJSONObject} from "../typed-json/i-json-object";
import {IMCSServiceInfo} from "./i-mcs-service-info";

export interface IMCS {
    newMCSClient(host:string):IMCSRestClient;
    newMCSRestSession(authedRestClient:IRestClientAsPromised):IMCSRestSession;
    newMCSDashboardInfo(dashboardInfoJSONObject:IJSONObject):IMCSDashboardInfo;
    newMCSServiceInfo(name:string, serviceJSONObject:IJSONObject):IMCSServiceInfo;
}