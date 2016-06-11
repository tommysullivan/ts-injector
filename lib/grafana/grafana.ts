import RestClientAsPromised from "../rest/rest-client-as-promised";
import GrafanaRestSession from "./grafana-rest-session";
import IJSONObject from "../typed-json/i-json-object";
import IFileSystem from "../node-js-wrappers/i-filesystem";
import GrafanaRestClient from "./grafana-rest-client";
import Rest from "../rest/rest";

export default class Grafana {
    private configJSON:IJSONObject;
    private fileSystem:IFileSystem;
    private rest:Rest;

    constructor(configJSON:IJSONObject, fileSystem:IFileSystem, rest:Rest) {
        this.configJSON = configJSON;
        this.fileSystem = fileSystem;
        this.rest = rest;
    }

    newRestSession(authedRestClient:RestClientAsPromised):GrafanaRestSession {
        return new GrafanaRestSession(authedRestClient, this.configJSON.stringPropertyNamed('grafanaDashboardImportPath'), this.fileSystem);
    }

    newGrafanaRestClient():GrafanaRestClient {
        return new GrafanaRestClient(
            this,
            this.configJSON.stringPropertyNamed('grafanaHostAndOptionalPort'),
            this.configJSON.stringPropertyNamed('grafanaLoginPath'),
            this.configJSON.stringPropertyNamed('defaultGrafanaUsername'),
            this.configJSON.stringPropertyNamed('defaultGrafanaPassword'),
            this.rest
        );
    }
}