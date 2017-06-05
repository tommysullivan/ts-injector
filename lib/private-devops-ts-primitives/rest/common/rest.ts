import {IRest} from "./i-rest";
import {IHTTPClientCache} from "./i-http-client-cache";
import {ICollections} from "../../collections/i-collections";
import {HTTPClientCache} from "./http-client-cache";
import {IRestResponse} from "./i-rest-response";
import {IError} from "../../errors/i-error";
import {RestError} from "./rest-error";
import {IRestClient} from "./i-rest-client";

export abstract class Rest implements IRest {
    private static httpClientCache:IHTTPClientCache;

    constructor(
        protected collections:ICollections
    ) {}

    get singletonHTTPClientCache():IHTTPClientCache {
        return Rest.httpClientCache || (Rest.httpClientCache = this.newHTTPClientCache());
    }

    abstract newRestClient(baseURL?: string):IRestClient;

    newRestError(restResponse:IRestResponse):IError {
        return new RestError(restResponse);
    }

    newHTTPClientCache():IHTTPClientCache {
        return new HTTPClientCache(
            this.collections.newEmptyDictionary<IRestResponse>(),
            () => this.collections.newEmptyDictionary<IRestResponse>()
        )
    }
}