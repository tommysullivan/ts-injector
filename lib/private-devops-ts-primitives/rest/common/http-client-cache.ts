import {IHTTPClientCache} from "./i-http-client-cache";
import {IRestResponse} from "./i-rest-response";
import {IDictionary} from "../../collections/i-dictionary";
import {IRestRequestOptions} from "./i-rest-request-options";

export class HTTPClientCache implements IHTTPClientCache {
    constructor(
        private cache:IDictionary<IRestResponse>,
        private createNewCacheDictionary:()=>IDictionary<IRestResponse>
    ) {}

    addResponseIfApplicable(response:IRestResponse):void {
        if(response.headers.hasKey('etag')) this.cache.addOrUpdate(response.originalUrl, response);
    }

    addCacheHeadersIfApplicable(url:string, requestOptions:IRestRequestOptions):IRestRequestOptions {
        return {
            ...requestOptions,
            headers: {
                ...requestOptions.headers,
                ...(this.cache.hasKey(url) && { 'If-None-Match': this.cache.get(url).headers.get('etag') } )
            }
        };
    }

    previousResponseForUrl(url:string):IRestResponse {
        return this.cache.get(url);
    }

    clear():void {
        this.cache = this.createNewCacheDictionary();
    }

    containsCachedResponseFor(url:string):boolean {
        return this.cache.hasKey(url);
    }

    shouldSendPreviousResponse(currentResponse:IRestResponse):boolean {
        return currentResponse.statusCode==304 && this.containsCachedResponseFor(currentResponse.originalUrl);
    }
}