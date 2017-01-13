import {IJSONObject} from "../../typed-json/i-json-object";
import {IJSONValue, IJSONHash, IJSONArray} from "../../typed-json/i-json-value";

export interface IRestResponse {
    isError:boolean;
    toJSON():IJSONValue;
    originalUrl:string;
    body:string;
    jsonBody:IJSONValue;
    jsonHash:IJSONHash;
    jsonArray:IJSONArray;
    bodyAsJsonObject:IJSONObject;
    statusCode:number;
}