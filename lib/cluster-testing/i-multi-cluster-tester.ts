import {IList} from "../collections/i-list";
import {IFuture} from "../futures/i-future";
import {ITestResult} from "../testing/i-test-result";

export interface IMultiClusterTester {
    runCucumberForEachClusterAndSaveResultsToPortalIfApplicable(
        clusterIds:IList<string>, cucumberPassThruCommands:IList<string>
    ):IFuture<IList<ITestResult>>;
}