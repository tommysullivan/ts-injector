import {IGrafanaConfig} from "./i-grafana-config";
import {IJSONObject} from "../typed-json/i-json-object";

export class GrafanaConfig implements IGrafanaConfig {
    constructor(
        private configJSON:IJSONObject
    ) {}

    get grafanaDashboardImportPath(): string {
        return this.configJSON.stringPropertyNamed('grafanaDashboardImportPath');
    }

    get grafanaHostAndOptionalPort(): string {
        return this.configJSON.stringPropertyNamed('grafanaHostAndOptionalPort');
    }

    get grafanaLoginPath(): string {
        return this.configJSON.stringPropertyNamed('grafanaLoginPath');
    }

    get defaultGrafanaUsername(): string {
        return this.configJSON.stringPropertyNamed('defaultGrafanaUsername');
    }

    get defaultGrafanaPassword(): string {
        return this.configJSON.stringPropertyNamed('defaultGrafanaPassword');
    }
}