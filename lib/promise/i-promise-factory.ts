import {IFuture} from "./i-future";
import {IList} from "../collections/i-list";

export interface IPromiseFactory {
    newPromiseForRejectedImmediateValue<T>(value:T):IFuture<T>;
    newPromiseForImmediateValue<T>(value:T):IFuture<T>;
    newPromise<T>(resolver:(resolve: (value: T) => void, reject: (reason: any) => void) => void):IFuture<T>;
    newGroupPromiseFromArray<T>(promises:Array<IFuture<T>>):IFuture<IList<T>>;
    newGroupPromise<T>(promises:IList<IFuture<T>>):IFuture<IList<T>>;
    delayedPromise<T>(timeout:number, delayedOperation:()=>IFuture<T>):IFuture<T>;
}