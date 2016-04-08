import IJSONObject from "./i-json-object";

interface ITypedJSON {
    newJSONObject(rawJSONObject:Object):IJSONObject;
    isArray(potentialArray:any):boolean;
}

export default ITypedJSON;