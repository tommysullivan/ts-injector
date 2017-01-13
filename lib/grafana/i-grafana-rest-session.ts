import {IRestResponse} from "../rest/common/i-rest-response";
import {IFuture} from "../futures/i-future";
import {IList} from "../collections/i-list";

export interface IGrafanaRestSession {
    uploadGrafanaDashboard(dashboardName:string, fqdns:IList<string>):IFuture<IRestResponse>;
}