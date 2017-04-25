import {IRestResponse} from "./i-rest-response";
import {IRestRequestOptions} from "./i-rest-request-options";

export interface IHTTPClientCache {
    addResponseIfApplicable(response:IRestResponse):void;
    addCacheHeadersIfApplicable(url:string, requestOptions:IRestRequestOptions):IRestRequestOptions;
    containsCachedResponseFor(url:string):boolean;
    previousResponseForUrl(url:string):IRestResponse;
    clear():void;
}