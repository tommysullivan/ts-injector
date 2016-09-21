import {GrafanaRestSession} from "./grafana-rest-session";
import {IFileSystem} from "../node-js-wrappers/i-filesystem";
import {GrafanaRestClient} from "./grafana-rest-client";
import {IRestClientAsPromised} from "../rest/i-rest-client-as-promised";
import {IRest} from "../rest/i-rest";
import {IGrafanaRestSession} from "./i-grafana-rest-session";
import {IGrafana} from "./i-grafana";
import {IGrafanaRestClient} from "./i-grafana-rest-client";
import {IGrafanaConfig} from "./i-grafana-config";

export class Grafana implements IGrafana {
    constructor(
        private config:IGrafanaConfig,
        private fileSystem:IFileSystem,
        private rest:IRest
    ) {}

    newRestSession(authedRestClient:IRestClientAsPromised):IGrafanaRestSession {
        return new GrafanaRestSession(
            authedRestClient,
            this.config.grafanaDashboardImportPath,
            this.fileSystem
        );
    }

    newGrafanaRestClient():IGrafanaRestClient {
        return new GrafanaRestClient(
            this,
            this.config.grafanaHostAndOptionalPort,
            this.config.grafanaLoginPath,
            this.config.defaultGrafanaUsername,
            this.config.defaultGrafanaPassword,
            this.rest
        );
    }
}