import {IFuture} from "../futures/i-future";

export interface IResultReporter {
    reportResult(uniqueFileIdentifier:string, portalCompatibleJSONResultString:string):IFuture<any>;
}