import {IPromiseFactory} from "./i-promise-factory";
import {IList} from "../collections/i-list";
import {IFuture} from "../promise/i-future";
import {ICollections} from "../collections/i-collections";

export class PromiseFactory implements IPromiseFactory {
    private promiseModule:any;
    private collections:ICollections;

    constructor(promiseModule:any, collections:ICollections) {
        this.promiseModule = promiseModule;
        this.collections = collections;
    }

    newPromiseForImmediateValue<T>(value:T):IFuture<T> {
        return this.promiseModule.resolve(value);
    }

    newPromise<T>(resolver:(resolve: (value: T) => void, reject: (reason: any) => void) => void):IFuture<T> {
        return new this.promiseModule(resolver);
    }

    newGroupPromiseFromArray<T>(promises:Array<IFuture<T>>):IFuture<IList<T>> {
        return this.promiseModule.all(promises)
            .then(arrayOfResolvedValues => this.collections.newList<T>(arrayOfResolvedValues));
    }

    newGroupPromise<T>(promises:IList<IFuture<T>>):IFuture<IList<T>> {
        return this.newGroupPromiseFromArray(promises.toArray());
    }

    newPromiseForRejectedImmediateValue<T>(value:T):IFuture<T> {
        return this.promiseModule.reject(value);
    }

    delayedPromise<T>(timeout:number, delayedOperation:()=>IFuture<T>):IFuture<T> {
        return this.newPromise((resolve, reject) => {
            const executeDelayedOperation = () => delayedOperation().then(resolve, reject);
            setTimeout(executeDelayedOperation, timeout);
        });
    }
}