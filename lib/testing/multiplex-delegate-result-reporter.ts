import {IResultReporter} from "./i-result-reporter";
import {IList} from "../collections/i-list";
import {IFuture} from "../futures/i-future";

export class MultiplexDelegateResultReporter implements IResultReporter {

    constructor(
        private reportersToDelegateTo:IList<IResultReporter>
    ) {}

    reportResult(uniqueFileIdentifier:string, portalCompatibleJSONResultString:string):IFuture<any> {
        return this.reportersToDelegateTo.mapToFutureList(
            r=>r.reportResult(uniqueFileIdentifier, portalCompatibleJSONResultString)
        );
    }
}