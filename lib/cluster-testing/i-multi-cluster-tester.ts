import {IClusterTestResult} from "./i-cluster-test-result";
import {IList} from "../collections/i-list";
import {IFuture} from "../promise/i-future";

export interface IMultiClusterTester {
    runCucumberForEachClusterAndSaveResultsToPortalIfApplicable(
        cucumberPassThruCommands:IList<string>
    ):IFuture<IList<IClusterTestResult>>;
}