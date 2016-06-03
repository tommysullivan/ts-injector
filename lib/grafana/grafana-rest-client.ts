import IThenable from "../promise/i-thenable";
import GrafanaRestSession from "./grafana-rest-session";
import Grafana from "./grafana";
import IHTTP from "../http/i-http";
import RestClientAsPromised from "../rest/rest-client-as-promised";
import Rest from "../rest/rest";

export default class GrafanaRestClient {

    private grafana:Grafana;
    private grafanaHostAndOptionalPort:string;
    private grafanaLoginPath:string;
    private defaultUsername:string;
    private defaultPassword:string;
    private rest:Rest;

    constructor(grafana:Grafana, grafanaHostAndOptionalPort:string, grafanaLoginPath:string, defaultUsername:string, defaultPassword:string, rest:Rest) {
        this.grafana = grafana;
        this.grafanaHostAndOptionalPort = grafanaHostAndOptionalPort;
        this.grafanaLoginPath = grafanaLoginPath;
        this.defaultUsername = defaultUsername;
        this.defaultPassword = defaultPassword;
        this.rest = rest;
    }

    createAutheticatedSessionWithDefaultCredentials():IThenable<GrafanaRestSession> {
        return this.createAutheticatedSession(this.defaultUsername, this.defaultPassword);
    }

    createAutheticatedSession(username:string, password:string):IThenable<GrafanaRestSession> {
        var restClientAsPromised = this.rest.newRestClientAsPromised(this.grafanaHostAndOptionalPort);
        var postPayload = {
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