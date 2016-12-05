import {IList} from "../collections/i-list";
import {IFileSystem} from "../node-js-wrappers/i-filesystem";
import {IFuture} from "../futures/i-future";
import {IRestClientAsPromised} from "../rest/i-rest-client-as-promised";
import {IRestResponse} from "../rest/i-rest-response";
import {IGrafanaRestSession} from "./i-grafana-rest-session";

export class GrafanaRestSession implements IGrafanaRestSession {
    constructor(
        private authedRestClient:IRestClientAsPromised,
        private grafanaDashboardImportPath:string,
        private fileSystem:IFileSystem
    ) {}

    uploadGrafanaDashboard(dashboardName:string, fqdns:IList<string>):IFuture<IRestResponse> {
        //TODO: Replace dashboard JSON fqdns with those passed in as an arg
        //TODO: Determine why we receive 404 here
        const dashboardJSON = this.fileSystem.readFileSync(`../../dashboards/${dashboardName}_dashboard.json`);
        const postPayload = {
            body: {
                dashboard: dashboardJSON,
                overwrite: false
            },
            json: true
        }
        return this.authedRestClient.post(this.grafanaDashboardImportPath, postPayload);
    }
}