import {ICollections} from "./i-collections";
import {List} from "./list";
import {IList} from "./i-list";
import {Dictionary} from "./dictionary";
import {IDictionary} from "./i-dictionary";
import {IFuture} from "../futures/i-future";
import {IHash} from "./i-hash";
import {IPair, ITriplet, I4Tuple} from "./tuples";

export class Collections implements ICollections {
    constructor(
        private createFutureList:<S>(listOfFutures:IList<IFuture<S>>)=>IFuture<IList<S>>
    ) {}

    newList<T>(items:Array<T>=[]):IList<T> {
        return new List<T>(items, listOfFutures => this.createFutureList(listOfFutures));
    }

    newEmptyList<T>():IList<T> {
        return this.newList<T>([]);
    }

    newRange(start:number, end:number):IList<number> {
        let arrayOfCorrectSize = [];
        for(let c=start; c<end; c++) {
            arrayOfCorrectSize.push(c);
        }
        return this.newList<number>(arrayOfCorrectSize);
    }

    newDictionary<T>(initialItems:IHash<T>):IDictionary<T> {
        return new Dictionary<T>(initialItems, this);
    }

    newEmptyDictionary<T>():IDictionary<T> {
        return new Dictionary<T>({}, this);
    }

    newListOfSize(size:number):IList<number> {
        let arrayOfCorrectSize = [];
        for(let c=0; c<size; c++) {
            arrayOfCorrectSize.push(c);
        }
        return this.newList<number>(arrayOfCorrectSize);
    }

    newPair<T1, T2>(item1:T1, item2:T2):IPair<T1, T2> {
        return { _1:item1, _2:item2 }
    }

    newTriplet<T1, T2, T3>(item1:T1, item2:T2, item3:T3):ITriplet<T1, T2, T3> {
        return { _1:item1, _2:item2, _3:item3}
    }
    new4Tuple<T1, T2, T3, T4>(item1:T1, item2:T2, item3:T3, item4:T4):I4Tuple<T1, T2, T3, T4> {
        return { _1:item1, _2:item2, _3:item3, _4:item4}
    }
}