import {IJSONObject} from "../typed-json/i-json-object";

export interface IRestResponse {
    isError:boolean;
    toJSON():any;
    originalUrl:string;
    body:string;
    jsonBody:any;
    bodyAsJsonObject:IJSONObject;
    statusCode:number;
}