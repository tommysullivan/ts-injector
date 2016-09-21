import {IList} from "./i-list";
import {IDictionary} from "./i-dictionary";
import {IHash} from "./i-hash";

export interface ICollections {
    newList<T>(items:Array<T>):IList<T>;
    newEmptyList<T>():IList<T>;
    newDictionary<T>(initialHash:IHash<T>):IDictionary<T>;
    newEmptyDictionary<T>():IDictionary<T>;
    newListOfSize(size:number):IList<number>;
    newRange(start:number, end:number):IList<number>;
}