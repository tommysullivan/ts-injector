import IPromiseFactory from "./i-promise-factory";
import IList from "../collections/i-list";
import IThenable from "../promise/i-thenable";
import ICollections from "../collections/i-collections";

export default class PromiseFactory implements IPromiseFactory {
    private promiseModule:any;
    private collections:ICollections;

    constructor(promiseModule:any, collections:ICollections) {
        this.promiseModule = promiseModule;
        this.collections = collections;
    }

    newPromiseForImmediateValue<T>(value:T):IThenable<T> {
        return this.promiseModule.resolve(value);
    }

    newPromise<T>(resolver:(resolve: (value: T) => void, reject: (reason: any) => void) => void):IThenable<T> {
        return new this.promiseModule(resolver);
    }

    newGroupPromiseFromArray<T>(promises:Array<IThenable<T>>):IThenable<IList<T>> {
        return this.promiseModule.all(promises)
            .then(arrayOfResolvedValues => this.collections.newList<T>(arrayOfResolvedValues));
    }

    newGroupPromise<T>(promises:IList<IThenable<T>>):IThenable<IList<T>> {
        return this.newGroupPromiseFromArray(promises.toArray());
    }

    newPromiseForRejectedImmediateValue<T>(value:T):IThenable<T> {
        return this.promiseModule.reject(value);
    }
}