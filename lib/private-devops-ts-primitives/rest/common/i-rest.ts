import {IRestClient} from "./i-rest-client";
import {IRestResponse} from "./i-rest-response";
import {IError} from "../../errors/i-error";
import {IHTTPClientCache} from "./i-http-client-cache";

export interface IRest {
    newRestClient(baseURL?:string):IRestClient;
    newRestError(restResponse:IRestResponse):IError;
    singletonHTTPClientCache:IHTTPClientCache;
    newHTTPClientCache():IHTTPClientCache;
}