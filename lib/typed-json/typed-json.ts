import IJSONObject from "./i-json-object";
import JSONObject from "./json-object";
import ICollections from "../collections/i-collections";
import ITypedJSON from "./i-typed-json";

export default class TypedJSON implements ITypedJSON {
    private spacingForStringify:number;
    private collections:ICollections;

    constructor(spacingForStringify:number, collections:ICollections) {
        this.spacingForStringify = spacingForStringify;
        this.collections = collections;
    }

    newJSONObject(rawJSONObject:Object):IJSONObject {
        return new JSONObject(
            rawJSONObject,
            this.spacingForStringify,
            this.collections,
            this
        );
    }

    isArray(potentialArray:any):boolean {
        return (Object.prototype.toString.call(potentialArray) == '[object Array]');
    }
}