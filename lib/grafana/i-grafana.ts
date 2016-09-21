import {IGrafanaRestSession} from "./i-grafana-rest-session";
import {IRestClientAsPromised} from "../rest/i-rest-client-as-promised";
import {IGrafanaRestClient} from "./i-grafana-rest-client";

export interface IGrafana {
    newRestSession(authedRestClient:IRestClientAsPromised):IGrafanaRestSession;
    newGrafanaRestClient():IGrafanaRestClient;
}