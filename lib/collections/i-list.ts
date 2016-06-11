import IComparator from "./i-comparator";

interface IList<T> {
    all(predicate:(originalItem:T)=>boolean):boolean;
    map<T2>(mapFunction:(originalItem:T) => T2):IList<T2>;
    filter(filterFunction:(originalItem:T)=>boolean):IList<T>;
    where(filterFunction:(originalItem:T)=>boolean):IList<T>;
    first(exceptionMessage?:string):T;
    rest():IList<T>;
    clone():IList<T>;
    firstWhere(predicate:(item:T) =>boolean, exceptionMessage?:string):T;
    contains(soughtItem:T):boolean;
    contain(soughtItem:T):boolean;
    containsAll(soughtItems:IList<T>):boolean;
    containAll(soughtItems:IList<T>):boolean;
    push(item:T):IList<T>;
    toArray():Array<T>;
    toJSON():Array<T>;
    forEach(eachFunction:(item:T) => any):IList<T>;
    itemAt(index:number):T;
    flatten<T2>():IList<T2>;
    join(separator:string):string;
    toJSONString():string;
    unique():IList<T>;
    sort():IList<T>;
    sortWith(sorter:IComparator<T>):IList<T>;
    limitTo(maxResults:number):IList<T>;
    append(listToAppend:IList<T>):IList<T>;
    flatMap<T2>(mapFunction:(originalItem:T) => IList<T2>):IList<T2>;
    flatMapArray<T2>(mapFunction:(originalItem:T) => Array<T2>):IList<T2>;
    notEmpty():boolean;
    everythingAfterIndex(index:number):IList<T>;
    hasAtLeastOne(predicate:(item:T)=>boolean):boolean;
    last:T;
    isEmpty:boolean;
    length:number;
    hasMany:boolean;
}

export default IList;