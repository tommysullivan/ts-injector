import {IJSONHash} from "../../typed-json/i-json-value";
export interface IRequestHeadersForNodeJS {
    Accept?:string;
    'Content-Type'?:string;
    qs?:IJSONHash;
}