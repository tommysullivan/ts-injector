import {IFuture} from "../futures/i-future";
import {IGrafanaRestSession} from "./i-grafana-rest-session";

export interface IGrafanaRestClient {
    createAutheticatedSessionWithDefaultCredentials():IFuture<IGrafanaRestSession>;
}