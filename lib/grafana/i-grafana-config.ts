import {IJSONSerializable} from "../typed-json/i-json-serializable";

export interface IGrafanaConfig extends IJSONSerializable {
    grafanaDashboardImportPath:string;
    grafanaHostAndOptionalPort:string;
    grafanaLoginPath:string;
    defaultGrafanaUsername:string;
    defaultGrafanaPassword:string;
}