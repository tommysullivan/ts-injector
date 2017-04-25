import {IRestClient} from "../common/i-rest-client";
import {IRest} from "../common/i-rest";
import {IRestResponse} from "../common/i-rest-response";
import {IFutures} from "../../futures/i-futures";
import {IFuture} from "../../futures/i-future";
import {INativeRequestOptions} from "./i-request-options";
import {INativeServerRequestor} from "./i-native-server-requestor";
import {IRestForNodeJS} from "./i-rest-for-node-js";
import {INativeServerResponse} from "./i-native-server-response";
import {INativeServerResponseHandler} from "./i-native-server-response-handler";
import {IHash} from "../../collections/i-hash";
import {IJSONValue, IJSONHash} from "../../typed-json/i-json-value";
import {IRestRequestOptions} from "../common/i-rest-request-options";
import {IHTTPClientCache} from "../common/i-http-client-cache";

type INativeHttpRequestMethod = (url:string, options:INativeRequestOptions, responseHandler:INativeServerResponseHandler) => void;

export class RestClientForNodeJS implements IRestClient {
    constructor(
        private futures:IFutures,
        private nativeRequestor:INativeServerRequestor,
        private baseUrl:string,
        private rest:IRest,
        private restForNodeJS:IRestForNodeJS,
        private httpClientCache:IHTTPClientCache
    ) {}

    postFormEncodedBody(path: string, formKeyValuePairs: IHash<string>): IFuture<IRestResponse> {
        return this.performRequest(
            path,
            { form: formKeyValuePairs },
            this.nativeRequestor.post,
            false
        );
    }

    post(path:string, jsonObjectToStringify?:IJSONValue):IFuture<IRestResponse> {
        return this.performRequest(
            path,
            this.createNativeRequestOptions(jsonObjectToStringify),
            this.nativeRequestor.post,
            false
        );
    }

    postPlainText(path:string, postString:string):IFuture<IRestResponse> {
        return this.performRequest(
            path,
            {
                body: postString,
                headers: {
                    'Content-Type': 'text/plain'
                }
            },
            this.nativeRequestor.post,
            false
        );
    }

    getWithQueryString(path:string, queryStringParams:IJSONHash):IFuture<IRestResponse> {
        return this.performRequest(
            path,
            {
                qs: queryStringParams
            },
            this.nativeRequestor.get,
            true
        );
    }

    getPlainText(path: string): IFuture<IRestResponse> {
        return this.performRequest(
            path,
            {
                headers: {
                    Accept: 'text/plain'
                }
            },
            this.nativeRequestor.get,
            true
        );
    }

    getJSONWithSpecificContentType(path:string, contentType:string):IFuture<IRestResponse> {
        return this.performRequest(
            path,
            {
                headers: {
                    Accept: contentType
                }
            },
            this.nativeRequestor.get,
            true
        );
    }

    get(path:string, options?:IRestRequestOptions):IFuture<IRestResponse> {
        return this.performRequest(
            path,
            this.createNativeRequestOptions(null, options),
            this.nativeRequestor.get,
            true
        );
    }

    patch(path:string, jsonObjectToStringify?:IJSONValue):IFuture<IRestResponse> {
        return this.performRequest(
            path,
            this.createNativeRequestOptions(jsonObjectToStringify),
            this.nativeRequestor.patch,
            false
        );
    }

    delete(path:string):IFuture<IRestResponse> {
        return this.performRequest(
            path,
            {},
            this.nativeRequestor.delete,
            false
        );
    }

    put(path:string, jsonObjectToStringify:IJSONValue, options?:IRestRequestOptions):IFuture<IRestResponse> {
        return this.performRequest(
            path,
            this.createNativeRequestOptions(jsonObjectToStringify, options),
            this.nativeRequestor.put,
            false
        );
    }

    private performRequest(path:string, requestOptions:INativeRequestOptions, nativeHttpRequestMethod:INativeHttpRequestMethod, useCache:boolean):IFuture<IRestResponse> {
        const url = this.fullPath(path);
        return this.futures.newFuture((resolve, reject) => {
            nativeHttpRequestMethod(
                url,
                this.httpClientCache.addCacheHeadersIfApplicable(url, requestOptions),
                (error:Error, response:INativeServerResponse) => {
                    if(useCache && response.statusCode==304 && this.httpClientCache.containsCachedResponseFor(url)) {
                        resolve(this.httpClientCache.previousResponseForUrl(url));
                    } else {
                        const responseWrapper = this.restForNodeJS.newRestResponse(error, response, url);
                        this.httpClientCache.addResponseIfApplicable(responseWrapper);
                        if(responseWrapper.isError) reject(this.rest.newRestError(responseWrapper));
                        else resolve(responseWrapper);
                    }
                }
            );
        });
    }

    private createNativeRequestOptions(requestBody:IJSONValue, options?:IRestRequestOptions):INativeRequestOptions {
        return {
            body: requestBody ? JSON.stringify(requestBody) : null,
            headers: options ? options.headers : undefined,
            qs: options ? options.queryString : null
        }
    }

    private fullPath(potentiallyFullOrPartialPath:string):string {
        return potentiallyFullOrPartialPath.indexOf('://')>=0
            ? potentiallyFullOrPartialPath
            : `${this.baseUrl}${potentiallyFullOrPartialPath}`;
    }

}