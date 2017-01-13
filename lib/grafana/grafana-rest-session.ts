import {IList} from "../collections/i-list";
import {IFileSystem} from "../node-js-wrappers/i-filesystem";
import {IFuture} from "../futures/i-future";
import {IRestClient} from "../rest/common/i-rest-client";
import {IRestResponse} from "../rest/common/i-rest-response";
import {IGrafanaRestSession} from "./i-grafana-rest-session";

export class GrafanaRestSession implements IGrafanaRestSession {
    constructor(
        private authedRestClient:IRestClient,
        private grafanaDashboardImportPath:string,
        private fileSystem:IFileSystem
    ) {}

    uploadGrafanaDashboard(dashboardName:string, fqdns:IList<string>):IFuture<IRestResponse> {
        //TODO: Replace dashboard JSON fqdns with those passed in as an arg
        const dashboardJSON = this.fileSystem.readJSONFileSync(`../../dashboards/${dashboardName}_dashboard.json`);
        const postPayload = {
            dashboard: dashboardJSON,
            overwrite: false
        };
        return this.authedRestClient.post(this.grafanaDashboardImportPath, postPayload);
    }
}