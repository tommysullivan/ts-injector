import {IGrafanaRestSession} from "./i-grafana-rest-session";
import {IRestClient} from "../rest/common/i-rest-client";
import {IGrafanaRestClient} from "./i-grafana-rest-client";

export interface IGrafana {
    newRestSession(authedRestClient:IRestClient):IGrafanaRestSession;
    newGrafanaRestClient():IGrafanaRestClient;
}