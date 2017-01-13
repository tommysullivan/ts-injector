import {GrafanaRestSession} from "./grafana-rest-session";
import {IFileSystem} from "../node-js-wrappers/i-filesystem";
import {GrafanaRestClient} from "./grafana-rest-client";
import {IRestClient} from "../rest/common/i-rest-client";
import {IRest} from "../rest/common/i-rest";
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

    newRestSession(authedRestClient:IRestClient):IGrafanaRestSession {
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