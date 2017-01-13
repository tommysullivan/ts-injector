import {IJSONObject} from "./i-json-object";
import {IList} from "../collections/i-list";
import {IJSONSerializer} from "./i-json-serializer";
import {IJSONMerger} from "./i-json-merger";
import {IJSONArray, IJSONHash} from "./i-json-value";
import {IJSONParser} from "./i-json-parser";

export interface ITypedJSON {
    newListOfJSONObjects(rawArray:IJSONArray):IList<IJSONObject>;
    newJSONObject(rawJSONObject:IJSONHash):IJSONObject;
    isArray(potentialArray:any):boolean;
    newJSONSerializer():IJSONSerializer;
    isJSON(json:any):boolean;
    newJSONMerger():IJSONMerger;
    jsonParser:IJSONParser;
}