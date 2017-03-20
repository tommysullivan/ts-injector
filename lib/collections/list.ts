import {IList} from "./i-list";
import {IComparator} from "./i-comparator";
import {IFuture} from "../futures/i-future";
import {ILogCaptureConfiguration} from "../clusters/i-log-capture-configuration";
import {IJSONObject} from "../typed-json/i-json-object";

export class List<T> implements IList<T> {
    constructor(
        private listItems:Array<T> = [],
        private createFutureList:<S>(futureItems:IList<IFuture<S>>)=>IFuture<IList<S>>
    ) {}

    mapToFutureList<T2>(mapFunction:(i:T, index?:number)=>IFuture<T2>):IFuture<IList<T2>> {
        return this.createFutureList(this.map(mapFunction));
    }

    flatMapToFutureList<T2>(mapFunction:(i:T)=>IFuture<IList<T2>>):IFuture<IList<T2>> {
        return this.mapToFutureList(mapFunction)
            .then(l => l.flatten());
    }

    private newList<S>(items?:Array<S>):IList<S> {
        return new List<S>(items, this.createFutureList);
    }

    get notEmpty():boolean {
        return !this.isEmpty;
    }

    get isEmpty():boolean {
        return this.listItems.length == 0;
    }

    get last():T {
        return this.itemAt(this.length-1);
    }

    get hasMany():boolean {
        return this.length > 1;
    }

    get rest():IList<T> {
        return this.newList(this.listItems.slice(1));
    }

    get unique():IList<T> {
        const uniqueList = this.newList<T>();
        this.forEach(i=>uniqueList.contains(i) ? null : uniqueList.push(i));
        return uniqueList;
    }

    get first():T {
        if(this.isEmpty) throw new Error('Cannot get first item in empty list');
        return this.listItems[0];
    }

    get length():number { return this.listItems.length; }

    all(predicate:(originalItem:T)=>boolean):boolean {
        return this.filter(predicate).length == this.length;
    }

    contain(soughtItem:T):boolean {
        return this.contains(soughtItem);
    }

    toString():string {
        const arrayOfAny:Array<any> = <Array<any>>this.toArray();
        return JSON.stringify(arrayOfAny.map(i=>i.toJSON ? i.toJSON() : i), null, 3);
    }

    filter(filterFunction:(originalItem:T)=>boolean):IList<T> {
        return this.newList<T>(this.listItems.filter(filterFunction));
    }

    where(filterFunction:(originalItem:T)=>boolean):IList<T> {
        return this.filter(filterFunction);
    }

    everythingAfterIndex(index:number):IList<T> {
        return this.newList<T>(this.toArray().slice(index+1));
    }

    toJSON():any {
        const arr:Array<any> = this.toArray();
        return arr.map(i=>(i != null && i.toJSON) ? i.toJSON() : i);
    }

    map<T2>(mapFunction:(originalItem:T, index?:number)=>T2):IList<T2> {
        return this.newList<T2>(this.mapToArray(mapFunction));
    }

    mapToArray<T2>(mapFunction:(originalItem:T, index?:number)=>T2):Array<T2> {
        return this.listItems.map(mapFunction);
    }

    contains(soughtItem:T):boolean {
        if(soughtItem['equals'] != null) {
            for(var i in this.listItems) {
                if (soughtItem['equals'](this.listItems[i])) return true;
            }
            return false;
        }
        else return this.listItems.indexOf(soughtItem)>-1;
    }

    containsAll(soughtItems:IList<T>):boolean {
        const uniqueSoughtItems = soughtItems.unique;
        return this
                .filter(i=>uniqueSoughtItems.contains(i))
                .unique
                .length == uniqueSoughtItems.length;
    }

    containAll(soughtItems:IList<T>):boolean { return this.containsAll(soughtItems); }

    push(item:T):IList<T> {
        this.listItems.push(item);
        return this;
    }

    clone():IList<T> {
        return this.newList<T>(this.toArray());
    }

    toArray():Array<T> {
        return this.listItems.map(i=>i);
    }

    forEach(eachFunction:(item:T)=>any):IList<T> {
        this.listItems.forEach(eachFunction);
        return this;
    }

    itemAt(index:number):T {
        if(index >= this.listItems.length) throw new Error(`Attempted to read index ${index} but list only contains ${this.length} items.`);
        return this.listItems[index];
    }

    flatten<T2>():IList<T2> {
        var newList:IList<T2> = this.newList<T2>();
        this.forEach(subArray=>{
            const castedSubArray:IList<T2> = <any>subArray;
            newList = newList.append(castedSubArray);
        });
        return newList;
    }

    append(listToAppend:IList<T>):IList<T> {
        const newList = this.clone();
        listToAppend.forEach(i=>newList.push(i));
        return newList;
    }

    firstWhere(predicate:(item:T)=>boolean, defaultProvider?:()=>T):T {
        const result = this.filter(predicate);
        return result.isEmpty
            ? defaultProvider
                ? defaultProvider()
                : result.first
            : result.first;
    }

    firstOrThrow(predicate:(potentialMatch:T)=>boolean, errorFactory:()=>Error):T {
        function throwError():any { throw errorFactory(); }
        return this.firstWhere(predicate, throwError);
    }

    join(separator:string):string {
        return this.listItems.join(separator);
    }

    sort():IList<T> {
        return this.newList<T>(this.toArray().sort());
    }

    sortWith(comparator:IComparator<T>):IList<T> {
        return this.newList<T>(this.toArray().sort(comparator));
    }

    flatMap<T2>(mapFunction:(originalItem:T) => IList<T2>):IList<T2> {
        return this.map(mapFunction).flatten<T2>();
    }

    flatMapArray<T2>(mapFunction:(originalItem:T) => Array<T2>):IList<T2> {
        return this.newList<Array<T2>>(this.mapToArray(mapFunction)).flatten<T2>();
    }

    limitTo(maxResults:number):IList<T> {
        return this.newList<T>(
            this.listItems.slice(
                Math.max(this.length - maxResults, 0)
            )
        );
    }

    hasAtLeastOne(predicate:(item:T)=>boolean):boolean {
        return !this.filter(predicate).isEmpty;
    }

    intersectionWith(other:IList<T>):IList<T> {
        return this.filter(e => other.contains(e))
    }

    fold<T2>(operation:(t:T, t2:T2)=>T2, identity:T2):T2 {
        return this.isEmpty ? identity : operation(this.first, this.rest.fold(operation, identity));
    }

    get sum():number {
        const thisAsListOfNumber:IList<number> = <IList<number>>(<any> this);
        return thisAsListOfNumber.fold(
            (a,b)=> {
                if(typeof(a)!='number') throw new Error(`Cannot sum a list whose elements are not numeric. Bad element: ${a}`);
                return a+b;
            }
            , 0);
    }

    zip<T2>(list1: IList<T2>): IList<[T,T2]> {
        return this.map((element, index) => <[T,T2]>[element, list1.itemAt(index)]);
    }

    zip2<T2, T3>(list1: IList<T2>, list2: IList<T3>): IList<[T,T2,T3]> {
        return this.map((element, index) => <[T,T2,T3]>[element, list1.itemAt(index), list2.itemAt(index)]);
    }
}