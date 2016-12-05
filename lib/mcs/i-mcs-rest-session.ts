import {IMCSDashboardInfo} from "./i-mcs-dashboard-info";
import {IFuture} from "../futures/i-future";

export interface IMCSRestSession {
    dashboardInfo:IFuture<IMCSDashboardInfo>;
    applicationLinkFor(applicationName:string):IFuture<string>;
}