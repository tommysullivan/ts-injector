import {IMCSDashboardInfo} from "./i-mcs-dashboard-info";
import {IFuture} from "../futures/i-future";
import {IList} from "../collections/i-list";
import {IMCSNodeInfo} from "./i-mcs-node-info";

export interface IMCSRestSession {
    dashboardInfo:IFuture<IMCSDashboardInfo>;
    applicationLinkFor(applicationName:string):IFuture<string>;
    nodeList:IFuture<IList<IMCSNodeInfo>>
}