import {deprecated} from "../annotations/deprecated";
import {IList} from "../collections/i-list";
import {ICollections} from "../collections/i-collections";
import {IFuture} from "./i-future";
import {IFutures} from "./i-futures";
import {IPromiseFactory} from "../promise/i-promise-factory";

export class Futures implements IFutures, IPromiseFactory {
    private promiseModule:any;
    private collections:ICollections;

    constructor(promiseModule:any, collections:ICollections) {
        this.promiseModule = promiseModule;
        this.collections = collections;
    }

    newFutureForImmediateValue<T>(value:T):IFuture<T> {
        return this.promiseModule.resolve(value);
    }

    @deprecated('Please use newFutureForImmediateValue() instead')
    newPromiseForImmediateValue<T>(value:T):IFuture<T> {
        return this.newFutureForImmediateValue<T>(value);
    }

    newFuture<T>(resolver:(resolve: (value: T) => void, reject: (reason: any) => void) => void):IFuture<T> {
        return new this.promiseModule(resolver);
    }

    @deprecated('Please use newFuture() instead')
    newPromise<T>(resolver:(resolve: (value: T) => void, reject: (reason: any) => void) => void):IFuture<T> {
        return this.newFuture<T>(resolver);
    }

    newFutureListFromArray<T>(futuresToGroupTogether:Array<IFuture<T>>):IFuture<IList<T>> {
        return this.promiseModule.all(futuresToGroupTogether)
            .then(arrayOfResolvedValues => this.collections.newList<T>(arrayOfResolvedValues));
    }

    @deprecated('Please use newFutureListFromArray() instead')
    newGroupPromiseFromArray<T>(promises:Array<IFuture<T>>):IFuture<IList<T>> {
        return this.newFutureListFromArray(promises);
    }

    newFutureList<T>(futures:IList<IFuture<T>>):IFuture<IList<T>> {
        return this.newFutureListFromArray(futures.toArray());
    }

    @deprecated('Please use newFutureList() instead')
    newGroupPromise<T>(promises:IList<IFuture<T>>):IFuture<IList<T>> {
        return this.newFutureList<T>(promises);
    }

    newRejectedFuture<T, R>(rejectedValue:R):IFuture<T> {
        return this.promiseModule.reject(rejectedValue);
    }

    @deprecated('Please use newRejectedFuture() instead')
    newPromiseForRejectedImmediateValue<T>(value:T):IFuture<T> {
        return this.promiseModule.reject(value);
    }

    newDelayedFuture<T>(millisecondsToWaitBeforeResolving:number, resolvedValue?:T):IFuture<T> {
        return this.newFuture((resolve, reject) =>
            setTimeout(() => resolve(resolvedValue), millisecondsToWaitBeforeResolving)
        );
    }

    @deprecated('Please use newDelayedFuture() instead')
    delayedPromise<T>(timeout:number, delayedOperation:()=>IFuture<T>):IFuture<T> {
        return this.newFuture((resolve, reject) => {
            const executeDelayedOperation = () => delayedOperation().then(resolve, reject);
            setTimeout(executeDelayedOperation, timeout);
        });
    }
}