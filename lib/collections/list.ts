import IList from "./i-list";
import IComparator from "./i-comparator";

export default class List<T> implements IList<T> {
    private listItems:Array<T>;

    constructor(listItems?:Array<T>) {
        this.listItems = listItems || [];
    }

    contain(soughtItem:T):boolean {
        return this.contains(soughtItem);
    }

    toString():string {
        return this.toJSONString();
    }

    notEmpty():boolean {
        return !this.isEmpty;
    }

    get isEmpty():boolean {
        return this.listItems.length == 0;
    }

    get length():number { return this.listItems.length; }

    rest():IList<T> {
        return new List<T>(this.listItems.slice(1));
    }

    filter(filterFunction:(originalItem:T)=>boolean):IList<T> {
        return new List<T>(this.listItems.filter(filterFunction));
    }

    unique():IList<T> {
        var uniqueList = new List<T>();
        this.forEach(i=>uniqueList.contains(i) ? null : uniqueList.push(i));
        return uniqueList;
    }

    everythingAfterIndex(index:number):IList<T> {
        return new List<T>(this.toArray().slice(index+1));
    }

    get hasMany():boolean {
        return this.length > 1;
    }

    toJSON():any {
        var arr:Array<any> = this.toArray();
        return arr.map(i=>(i != null && i.toJSON) ? i.toJSON() : i);
    }

    first(exceptionMessage?:string):T {
        if(this.listItems.length==0) throw new Error(exceptionMessage || 'Cannot get first item in empty list');
        return this.listItems[0];
    }

    map<T2>(mapFunction:(originalItem:T)=>T2):IList<T2> {
        return new List<T2>(this.listItems.map(mapFunction));
    }

    contains(soughtItem:T):boolean {
        return this.listItems.indexOf(soughtItem)>-1;
    }

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
        return this.listItems[index];
    }

    flatten<T2>():IList<T2> {
        var newList:IList<T2> = new List<T2>();
        this.forEach(subArray=>{
            var castedSubArray:IList<T2> = <any>subArray;
            newList = newList.append(castedSubArray);
        });
        return newList;
    }

    append(listToAppend:IList<T>):IList<T> {
        var newList = this.clone();
        listToAppend.forEach(i=>newList.push(i));
        return newList;
    }

    firstWhere(predicate:(item:T) =>boolean, exceptionMessage?:string):T {
        return this.filter(predicate).first(exceptionMessage);
    }

    join(separator:string):string {
        return this.listItems.join(separator);
    }

    toJSONString():string {
        var arrayOfAny:Array<any> = <Array<any>>this.toArray();
        return JSON.stringify(arrayOfAny.map(i=>i.toJSON ? i.toJSON() : i), null, 3);
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

    limitTo(maxResults:number):IList<T> {
        return new List<T>(
            this.listItems.slice(
                Math.max(this.length - maxResults, 0)
            )
        );
    }
}