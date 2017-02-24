import {IJSONObject} from "../../typed-json/i-json-object";
import {IJSONValue, IJSONHash, IJSONArray} from "../../typed-json/i-json-value";
import {IList} from "../../collections/i-list";
import {IDictionary} from "../../collections/i-dictionary";

export interface IRestResponse {
    isError:boolean;
    toJSON():IJSONValue;
    headers:IDictionary<string>;
    originalUrl:string;
    body:string;
    jsonBody:IJSONValue;
    jsonHash:IJSONHash;
    jsonArray:IJSONArray;
    bodyAsJsonObject:IJSONObject;
    bodyAsListOfJsonObjects:IList<IJSONObject>;
    statusCode:number;
}