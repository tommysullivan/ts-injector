import {deprecated} from "../annotations/deprecated";
import {IList} from "../collections/i-list";
import {ICollections} from "../collections/i-collections";
import {IFuture} from "./i-future";
import {IFutures} from "./i-futures";
import {IPair, ITriplet, I4Tuple} from "../collections/tuples";

export class Futures implements IFutures {
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

    newFuture<T>(resolver:(resolve: (value?: T) => void, reject: (reason: any) => void) => void):IFuture<T> {
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

    newFutureArray<T>(futures:Array<IFuture<T>>):IFuture<Array<T>> {
        return this.newFutureListFromArray(futures).then(r => r.toArray());
    }

    newFutureArrayFromList<T>(futures:IList<IFuture<T>>):IFuture<Array<T>> {
        return this.newFutureList(futures).then(r => r.toArray());
    }

    newFuturePairFromPair<T1, T2>(pairOfFutures:IPair<IFuture<T1>, IFuture<T2>>):IFuture<IPair<T1, T2>> {
        return this
            .newFutureArray<T1 | T2>([pairOfFutures._1, pairOfFutures._2])
            .then(result => this.collections.newPair(<T1> result[0], <T2> result[1]));
    }

    newFuturePair<T1, T2>(item1:IFuture<T1>, item2:IFuture<T2>):IFuture<IPair<T1, T2>> {
        return this.newFuturePairFromPair(this.collections.newPair(item1, item2));
    }

    newFutureTripletFromTriplet<T1, T2, T3>(tripletOfFutures:ITriplet<IFuture<T1>, IFuture<T2>, IFuture<T3>>):IFuture<ITriplet<T1, T2, T3>> {
        return this
            .newFutureArray<T1 | T2 | T3>([tripletOfFutures._1, tripletOfFutures._2, tripletOfFutures._3])
            .then(result => this.collections.newTriplet(<T1> result[0], <T2> result[1], <T3> result[2]));
    }

    newFutureTriplet<T1, T2, T3>(item1:IFuture<T1>, item2:IFuture<T2>, item3:IFuture<T3>):IFuture<ITriplet<T1, T2, T3>> {
        return this.newFutureTripletFromTriplet(this.collections.newTriplet(item1, item2, item3));
    }

    newFuture4TupleFrom4Tuple<T1, T2, T3, T4>(fourTupleOfFutures:I4Tuple<IFuture<T1>, IFuture<T2>, IFuture<T3>, IFuture<T4>>):IFuture<I4Tuple<T1, T2, T3, T4>> {
        return this
            .newFutureArray<T1 | T2 | T3 | T4>([fourTupleOfFutures._1, fourTupleOfFutures._2, fourTupleOfFutures._3, fourTupleOfFutures._4])
            .then(result => this.collections.new4Tuple(<T1> result[0], <T2> result[1], <T3> result[2], <T4> result[3]));
    }

    newFuture4Tuple<T1, T2, T3, T4>(item1:IFuture<T1>, item2:IFuture<T2>, item3:IFuture<T3>, item4:IFuture<T4>):IFuture<I4Tuple<T1, T2, T3, T4>> {
        return this.newFuture4TupleFrom4Tuple(this.collections.new4Tuple(item1, item2, item3, item4));
    }
}