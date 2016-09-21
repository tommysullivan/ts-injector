import {IJSONObject} from "./i-json-object";
import {JSONObject} from "./json-object";
import {ICollections} from "../collections/i-collections";
import {ITypedJSON} from "./i-typed-json";
import {IList} from "../collections/i-list";
import {IJSONSerializer} from "./i-json-serializer";
import {JSONSerializer} from "./json-serializer";
import {JSONMerger} from "./json-merger";
import {IJSONMerger} from "./i-json-merger";

export class TypedJSON implements ITypedJSON {
    private spacingForStringify:number;
    private collections:ICollections;

    constructor(spacingForStringify:number, collections:ICollections) {
        this.spacingForStringify = spacingForStringify;
        this.collections = collections;
    }

    newJSONSerializer():IJSONSerializer {
        return new JSONSerializer();
    }

    newJSONObject(rawJSONObject:Object):IJSONObject {
        return new JSONObject(
            rawJSONObject,
            this.spacingForStringify,
            this.collections,
            this
        );
    }

    newListOfJSONObjects(rawArray:Array<any>):IList<IJSONObject> {
        return this.collections.newList(rawArray.map(o=>this.newJSONObject(o)));
    }

    isArray(potentialArray:any):boolean {
        return (Object.prototype.toString.call(potentialArray) == '[object Array]');
    }

    isJSON(json):boolean{
        return json && json.constructor === {}.constructor;
    }

    newJSONMerger():IJSONMerger {
        return new JSONMerger(this.collections, this);
    }
}