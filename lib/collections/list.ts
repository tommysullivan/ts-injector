import {IList} from "./i-list";
import {IComparator} from "./i-comparator";

export class List<T> implements IList<T> {
    private listItems:Array<T>;

    constructor(listItems?:Array<T>) {
        this.listItems = listItems || [];
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
        return new List<T>(this.listItems.slice(1));
    }

    get unique():IList<T> {
        const uniqueList = new List<T>();
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
        return new List<T>(this.listItems.filter(filterFunction));
    }

    where(filterFunction:(originalItem:T)=>boolean):IList<T> {
        return this.filter(filterFunction);
    }

    everythingAfterIndex(index:number):IList<T> {
        return new List<T>(this.toArray().slice(index+1));
    }

    toJSON():any {
        const arr:Array<any> = this.toArray();
        return arr.map(i=>(i != null && i.toJSON) ? i.toJSON() : i);
    }

    map<T2>(mapFunction:(originalItem:T)=>T2):IList<T2> {
        return new List<T2>(this.mapToArray(mapFunction));
    }

    mapToArray<T2>(mapFunction:(originalItem:T)=>T2):Array<T2> {
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
        return new List<T>(this.toArray());
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
        var newList:IList<T2> = new List<T2>();
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
        return new List<T>(this.toArray().sort());
    }

    sortWith(comparator:IComparator<T>):IList<T> {
        return new List<T>(this.toArray().sort(comparator));
    }

    flatMap<T2>(mapFunction:(originalItem:T) => IList<T2>):IList<T2> {
        return this.map(mapFunction).flatten<T2>();
    }

    flatMapArray<T2>(mapFunction:(originalItem:T) => Array<T2>):IList<T2> {
        return new List<Array<T2>>(this.mapToArray(mapFunction)).flatten<T2>();
    }

    limitTo(maxResults:number):IList<T> {
        return new List<T>(
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
}