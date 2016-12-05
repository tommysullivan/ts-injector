import {ICollections} from "./i-collections";
import {List} from "./list";
import {IList} from "./i-list";
import {Dictionary} from "./dictionary";
import {IDictionary} from "./i-dictionary";
import {IFuture} from "../futures/i-future";

export class Collections implements ICollections {
    constructor(
        private createGroupPromise:<S>(promises:IList<IFuture<S>>)=>IFuture<IList<S>>
    ) {}

    newList<T>(items:Array<T>=[]):IList<T> {
        return new List<T>(items, items => this.createGroupPromise(items));
    }

    newEmptyList<T>():IList<T> {
        return this.newList<T>([]);
    }

    newRange(start:number, end:number):IList<number> {
        var arrayOfCorrectSize = [];
        for(var c=start; c<end; c++) {
            arrayOfCorrectSize.push(c);
        }
        return this.newList<number>(arrayOfCorrectSize);
    }

    newDictionary<T>(initialItems:any):IDictionary<T> {
        return new Dictionary<T>(initialItems, this);
    }

    newEmptyDictionary<T>():IDictionary<T> {
        return new Dictionary<T>({}, this);
    }

    newListOfSize(size:number):IList<number> {
        var arrayOfCorrectSize = [];
        for(var c=0; c<size; c++) {
            arrayOfCorrectSize.push(c);
        }
        return this.newList<number>(arrayOfCorrectSize);
    }
}