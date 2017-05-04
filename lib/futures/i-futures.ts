import {IFuture} from "./i-future";
import {IList} from "../collections/i-list";
import {IPair, ITriplet, I4Tuple} from "../collections/tuples";
import {IFutureWithProgress, IProgressCallback} from "./i-future-with-progress";

export interface IFutures {
    newFutureForImmediateValue<T>(value:T):IFuture<T>;
    newFutureListFromArray<T>(futuresToGroupTogether:Array<IFuture<T>>):IFuture<IList<T>>;
    newFutureList<T>(futures:IList<IFuture<T>>):IFuture<IList<T>>;
    newFutureArray<T>(futures:Array<IFuture<T>>):IFuture<Array<T>>;
    newFutureArrayFromList<T>(futures:IList<IFuture<T>>):IFuture<Array<T>>;
    newRejectedFuture<T, R>(rejectedValue:R):IFuture<T>;
    newDelayedFuture<T>(millisecondsToWaitBeforeResolving:number, resolvedValue?:T):IFuture<T>;
    newFuturePairFromPair<T1, T2>(pairOfFutures:IPair<T1, T2>):IFuture<IPair<T1, T2>>;
    newFuturePair<T1, T2>(item1:IFuture<T1>, item2:IFuture<T2>):IFuture<IPair<T1, T2>>;
    newFutureTripletFromTriplet<T1, T2, T3>(tripletOfFutures:ITriplet<IFuture<T1>, IFuture<T2>, IFuture<T3>>):IFuture<ITriplet<T1, T2, T3>>;
    newFutureTriplet<T1, T2, T3>(item1:IFuture<T1>, item2:IFuture<T2>, item3:IFuture<T3>):IFuture<ITriplet<T1, T2, T3>>;
    newFuture4TupleFrom4Tuple<T1, T2, T3, T4>(fourTupleOfFutures:I4Tuple<IFuture<T1>, IFuture<T2>, IFuture<T3>, IFuture<T4>>):IFuture<I4Tuple<T1, T2, T3, T4>>;
    newFuture4Tuple<T1, T2, T3, T4>(item1:IFuture<T1>, item2:IFuture<T2>, item3:IFuture<T3>, item4:IFuture<T4>):IFuture<I4Tuple<T1, T2, T3, T4>>;

    newFuture<T>(
        resolver:(
            resolve: (value?: T) => void,
            reject: (reason: any) => void
        ) => void
    ):IFuture<T>;

    newFutureWithProgress<ProgressType, ResultType>(
        resolver:(
            resolve: (value?: ResultType) => void,
            reject: (reason: any) => void,
            progress: (progressInfo:ProgressType) => void
        ) => void
    ):IFutureWithProgress<ProgressType, ResultType>;
}