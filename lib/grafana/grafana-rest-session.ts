import RestClientAsPromised from "../rest/rest-client-as-promised";
import IList from "../collections/i-list";
import IFileSystem from "../node-js-wrappers/i-filesystem";
import IThenable from "../promise/i-thenable";

export default class GrafanaRestSession {
    private authedRestClient:RestClientAsPromised;
    private grafanaDashboardImportPath:string;
    private fileSystem:IFileSystem;

    constructor(authedRestClient:RestClientAsPromised, grafanaDashboardImportPath:string, fileSystem:IFileSystem) {
        this.authedRestClient = authedRestClient;
        this.grafanaDashboardImportPath = grafanaDashboardImportPath;
        this.fileSystem = fileSystem;
    }

    uploadGrafanaDashboard(dashboardName:string, fqdns:IList<string>):IThenable<any> {
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