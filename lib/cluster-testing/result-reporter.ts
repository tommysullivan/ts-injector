import {IFuture} from "../promise/i-future";
import {IPromiseFactory} from "../promise/i-promise-factory";
import {IResultReporter} from "./i-result-reporter";
import {IList} from "../collections/i-list";
import {IClusterTestResult} from "./i-cluster-test-result";

export class MultiplexDelegateResultReporter implements IResultReporter {

    constructor(
        private reportersToDelegateTo:IList<IResultReporter>,
        private promiseFactory:IPromiseFactory
    ) {}

    reportResult(uniqueFileIdentifier:string, clusterTestResult:IClusterTestResult):IFuture<IClusterTestResult> {
        return this.promiseFactory.newGroupPromise(
            this.reportersToDelegateTo.map(r=>r.reportResult(uniqueFileIdentifier, clusterTestResult))
        ).then(results => clusterTestResult);
    }
}