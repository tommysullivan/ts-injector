import {IJSONObject} from "./i-json-object";
import {JSONObject} from "./json-object";
import {ICollections} from "../collections/i-collections";
import {ITypedJSON} from "./i-typed-json";
import {IList} from "../collections/i-list";
import {IJSONSerializer} from "./i-json-serializer";
import {JSONSerializer} from "./json-serializer";
import {JSONMerger} from "./json-merger";
import {IJSONMerger} from "./i-json-merger";
import {IJSONValue} from "./i-json-value";
import {IJSONParser} from "./i-json-parser";

export class TypedJSON implements ITypedJSON {
    constructor(
        private spacingForStringify:number,
        private collections:ICollections,
        private maxConfigErrorOutputLength:number
    ) {}

    get jsonParser():IJSONParser {
        return JSON;
    }

    newJSONSerializer():IJSONSerializer {
        return new JSONSerializer(
            this.jsonParser
        );
    }

    newJSONObject(rawJSONObject:IJSONValue):IJSONObject {
        return new JSONObject(
            rawJSONObject,
            this.spacingForStringify,
            this.collections,
            this,
            this.maxConfigErrorOutputLength,
            this.jsonParser
        );
    }

    newListOfJSONObjects(rawArray:Array<IJSONValue>):IList<IJSONObject> {
        return this.collections.newList(rawArray.map(o=>this.newJSONObject(o)));
    }

    isArray(potentialArray:any):boolean {
        return (Object.prototype.toString.call(potentialArray) == '[object Array]');
    }

    isJSON(json:any):boolean{
        try {
            JSON.stringify(json);
            return true;
        }
        catch(e) {
            return false;
        }
    }

    newJSONMerger():IJSONMerger {
        return new JSONMerger(this.collections, this);
    }
}