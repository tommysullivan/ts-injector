import {IJSONObject} from "./i-json-object";
import {IList} from "../collections/i-list";
import {IJSONSerializer} from "./i-json-serializer";
import {IJSONMerger} from "./i-json-merger";

export interface ITypedJSON {
    newListOfJSONObjects(rawArray:Array<any>):IList<IJSONObject>;
    newJSONObject(rawJSONObject:Object):IJSONObject;
    isArray(potentialArray:any):boolean;
    newJSONSerializer():IJSONSerializer;
    isJSON(json:any):boolean;
    newJSONMerger():IJSONMerger;
}