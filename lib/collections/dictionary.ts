import IDictionary from "./i-dictionary";
import ICollections from "./i-collections";
import IList from "./i-list";

export default class Dictionary<ValueType> implements IDictionary<ValueType> {
    private hash:any;
    private collections:ICollections;

    constructor(hash:any, collections:ICollections) {
        this.hash = hash;
        this.collections = collections;
    }

    add(key:string, value:ValueType):IDictionary<ValueType> {
        this.hash[key]=value;
        return this;
    }

    hasKey(key:string):boolean {
        return this.hash.hasOwnProperty(key);
    }

    get(key:string):ValueType {
        return this.hash[key];
    }

    getOrThrow(key:string, errorMessageIfNotExist?:string):ValueType {
        if(this.hash.hasOwnProperty(key)) return this.get(key);
        else throw new Error(`${errorMessageIfNotExist || 'Error'} - sought key was "${key}"`);
    }

    get keys():IList<string> {
        return this.collections.newList<string>(Object.keys(this.hash));
    }

    toJSON():any {
        return JSON.parse(JSON.stringify(this.hash));
    }

    toJSONString():string {
        return JSON.stringify(this.toJSON(), null, 3);
    }

    clone():IDictionary<ValueType> {
        return this.collections.newDictionary<ValueType>(this.toJSON());
    }
}