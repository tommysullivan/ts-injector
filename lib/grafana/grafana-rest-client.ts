import {IFuture} from "../promise/i-future";
import {IRest} from "../rest/i-rest";
import {IGrafanaRestClient} from "./i-grafana-rest-client";
import {IGrafana} from "./i-grafana";
import {IGrafanaRestSession} from "./i-grafana-rest-session";

export class GrafanaRestClient implements IGrafanaRestClient {

    constructor(
        private grafana:IGrafana,
        private grafanaHostAndOptionalPort:string,
        private grafanaLoginPath:string,
        private defaultUsername:string,
        private defaultPassword:string,
        private rest:IRest
    ) {}

    createAutheticatedSessionWithDefaultCredentials():IFuture<IGrafanaRestSession> {
        return this.createAutheticatedSession(this.defaultUsername, this.defaultPassword);
    }

    createAutheticatedSession(username:string, password:string):IFuture<IGrafanaRestSession> {
        const restClientAsPromised = this.rest.newRestClientAsPromised(this.grafanaHostAndOptionalPort);
        const postPayload = {
            body: {
                user: username,
                email: '',
                password: password
            },
            json: true
        };
        return restClientAsPromised.post(this.grafanaLoginPath, postPayload)
            .then(_=>this.grafana.newRestSession(restClientAsPromised));
    }
}