import {IDictionary} from "./i-dictionary";
import {ICollections} from "./i-collections";
import {IList} from "./i-list";
import {IHash} from "./i-hash";
import {IJSONValue} from "../typed-json/i-json-value";

export class Dictionary<ValueType> implements IDictionary<ValueType> {
    private hash:IHash<ValueType>;
    private collections:ICollections;

    constructor(hash:IHash<ValueType>, collections:ICollections) {
        this.hash = hash;
        this.collections = collections;
    }

    add(key:string, value:ValueType):IDictionary<ValueType> {
        if(this.hasKey(key)) throw new Error(`Cannot add key ${key}, it already exists with value ${value}`);
        this.hash[key]=value;
        return this;
    }

    addOrUpdate(key:string, value:ValueType):IDictionary<ValueType> {
        this.hash[key]=value;
        return this;
    }

    hasKey(key:string):boolean {
        return this.hash.hasOwnProperty(key);
    }

    get(key:string):ValueType {
        return <ValueType> this.hash[key];
    }

    getOrThrow(key:string, errorMessageIfNotExist?:string):ValueType {
        if(this.hash.hasOwnProperty(key)) return this.get(key);
        else throw new Error(`${errorMessageIfNotExist || 'Error'} - sought key was "${key}"`);
    }

    get keys():IList<string> {
        return this.collections.newList<string>(Object.keys(this.hash));
    }

    toJSON():IHash<ValueType> {
        return JSON.parse(JSON.stringify(this.hash));
    }

    toString():string {
        return JSON.stringify(this.toJSON(), null, 3);
    }

    clone():IDictionary<ValueType> {
        return this.collections.newDictionary<ValueType>(this.toJSON());
    }

    getOrDefault(key:string, defaultValue:ValueType):ValueType  {
        return this.hasKey(key) ? this.get(key) : defaultValue;
    }

    getOrLazyDefault(key:string, defaultValue:()=>ValueType):ValueType {
        return this.hasKey(key) ? this.get(key) : defaultValue();
    }
}