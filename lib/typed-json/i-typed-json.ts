import IJSONObject from "./i-json-object";
import IList from "../collections/i-list";

interface ITypedJSON {
    newListOfJSONObjects(rawArray:Array<any>):IList<IJSONObject>;
    newJSONObject(rawJSONObject:Object):IJSONObject;
    isArray(potentialArray:any):boolean;
}

export default ITypedJSON;