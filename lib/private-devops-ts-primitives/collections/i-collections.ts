import {IList} from "./i-list";
import {IDictionary} from "./i-dictionary";
import {IHash} from "./i-hash";
import {I4Tuple, IPair, ITriplet} from "./tuples";

export interface ICollections {
    newList<T>(items:Array<T>):IList<T>;
    newEmptyList<T>():IList<T>;
    newDictionary<T>(initialHash:IHash<T>):IDictionary<T>;
    newEmptyDictionary<T>():IDictionary<T>;
    newListOfSize(size:number):IList<number>;
    newRange(start:number, end:number):IList<number>;
    newPair<T1, T2>(item1:T1, item2:T2):IPair<T1, T2>;
    newTriplet<T1, T2, T3>(item1:T1, item2:T2, item3:T3):ITriplet<T1, T2, T3>;
    new4Tuple<T1, T2, T3, T4>(item1:T1, item2:T2, item3:T3, item4:T4):I4Tuple<T1, T2, T3, T4>;
}

export * from "./i-list";