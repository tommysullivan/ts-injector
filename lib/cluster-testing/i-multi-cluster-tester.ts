import {IList} from "../collections/i-list";
import {IFuture} from "../futures/i-future";
import {IReportedResult} from "./multi-cluster-tester";

export interface IMultiClusterTester {
    runCucumberForEachClusterAndSaveResultsToPortalIfApplicable(clusterIds: IList<string>, cucumberPassThruCommands: IList<string>): IFuture<IList<IReportedResult>>;
}