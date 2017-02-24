import {IJSONHash} from "../../typed-json/i-json-value";

export interface INativeServerResponse {
    statusCode:number;
    body:string;
    headers:IJSONHash;
}