import {IFuture} from "./i-future";
import {IList} from "../collections/i-list";

export interface IFutures {
    newFutureForImmediateValue<T>(value:T):IFuture<T>;
    newFuture<T>(resolver:(resolve: (value: T) => void, reject: (reason: any) => void) => void):IFuture<T>;
    newFutureListFromArray<T>(futuresToGroupTogether:Array<IFuture<T>>):IFuture<IList<T>>;
    newFutureList<T>(futures:IList<IFuture<T>>):IFuture<IList<T>>;
    newRejectedFuture<T, R>(rejectedValue:R):IFuture<T>;
    newDelayedFuture<T>(millisecondsToWaitBeforeResolving:number, resolvedValue?:T):IFuture<T>;
}