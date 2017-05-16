import {IResultReporter} from "./i-result-reporter";
import {IFuture} from "../futures/i-future";

export class MultiplexDelegateResultReporter implements IResultReporter {

    constructor(private fileSystemReporter: IResultReporter,
                private portalReporter: IResultReporter
    ) {}

    async reportResult(uniqueFileIdentifier: string, portalCompatibleJSONResultString: string): IFuture<string> {
        await this.fileSystemReporter.reportResult(uniqueFileIdentifier, portalCompatibleJSONResultString);
        return this.portalReporter.reportResult(uniqueFileIdentifier, portalCompatibleJSONResultString);
    }
}