import {IRestRequestHeaders} from "./i-rest-request-headers";
import {IJSONHash} from "../../typed-json/i-json-value";

export interface IRestRequestOptions {
    headers?:IRestRequestHeaders;
    queryString?:IJSONHash;
    auth?: {
        user:string,
        pass:string,
        sendImmediately:boolean
    }
}