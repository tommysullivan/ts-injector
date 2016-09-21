import {IRestResponse} from "../rest/i-rest-response";
import {IFuture} from "../promise/i-future";
import {IList} from "../collections/i-list";

export interface IGrafanaRestSession {
    uploadGrafanaDashboard(dashboardName:string, fqdns:IList<string>):IFuture<IRestResponse>;
}