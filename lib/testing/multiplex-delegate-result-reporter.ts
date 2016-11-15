import {IFuture} from "../promise/i-future";
import {IPromiseFactory} from "../promise/i-promise-factory";
import {IResultReporter} from "./i-result-reporter";
import {IList} from "../collections/i-list";

export class MultiplexDelegateResultReporter implements IResultReporter {

    constructor(
        private reportersToDelegateTo:IList<IResultReporter>,
        private promiseFactory:IPromiseFactory
    ) {}

    reportResult(uniqueFileIdentifier:string, portalCompatibleJSONResultString:string):IFuture<any> {
        return this.promiseFactory.newGroupPromise(
            this.reportersToDelegateTo.map(
                r=>r.reportResult(uniqueFileIdentifier, portalCompatibleJSONResultString)
            )
        );
    }
}