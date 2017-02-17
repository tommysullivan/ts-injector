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
import {IError} from "../../errors/i-error";
import {IRequestHeadersForNodeJS} from "./i-request-headers-for-node-js";
import {IHash} from "../../collections/i-hash";
import {IJSONValue, IJSONHash} from "../../typed-json/i-json-value";

type INativeInvoker = (fullURL:string, nativeResponseHandler:INativeServerResponseHandler)=>any;

export class RestClientForNodeJS implements IRestClient {
    constructor(
        private futures:IFutures,
        private builtInNodeJSRequestor:INativeServerRequestor,
        private baseUrl:string,
        private rest:IRest,
        private restForNodeJS:IRestForNodeJS
    ) {}

    postFormEncodedBody(path: string, formKeyValuePairs: IHash<string>): IFuture<IRestResponse> {
        return this.newFutureRestResponse(
            path,
            (url, handler) => this.builtInNodeJSRequestor.post(
                url,
                { form: formKeyValuePairs },
                handler
            )
        );
    }

    post(path:string, jsonObjectToStringify?:IJSONValue):IFuture<IRestResponse> {
        return this.newFutureRestResponse(
            path,
            (url, handler) => this.builtInNodeJSRequestor.post(
                url,
                this.jsonBodyWrapperFor(jsonObjectToStringify),
                handler
            )
        );
    }

    getWithQueryString(path:string, queryStringParams:IJSONHash):IFuture<IRestResponse> {
        return this.get(path, {
            'qs': queryStringParams
        });
    }

    getPlainText(path: string): IFuture<IRestResponse> {
        return this.get(path, {
            'Accept': 'text/plain'
        });
    }

    getJSONWithSpecificContentType(path:string, contentType:string):IFuture<IRestResponse> {
        return this.get(path, {
            'Content-Type': contentType
        })
    }

    get(path:string, headers?:IRequestHeadersForNodeJS):IFuture<IRestResponse> {
        return this.newFutureRestResponse(
            path,
            (url, handler) => this.builtInNodeJSRequestor.get(
                url,
                {
                    headers: headers
                },
                handler
            )
        );
    }

    patch(path:string, jsonObjectToStringify?:IJSONValue):IFuture<IRestResponse> {
        return this.newFutureRestResponse(
            path,
            (url, handler) => this.builtInNodeJSRequestor.patch(
                url,
                this.jsonBodyWrapperFor(jsonObjectToStringify),
                handler
            )
        );
    }

    delete(path:string):IFuture<IRestResponse> {
        return this.newFutureRestResponse(
            path,
            (url, handler) => this.builtInNodeJSRequestor.delete(url, handler)
        );
    }

    put(path:string, jsonObjectToStringify:IJSONValue):IFuture<IRestResponse> {
        return this.newFutureRestResponse(
            path,
            (url, handler) => this.builtInNodeJSRequestor.put(
                url,
                this.jsonBodyWrapperFor(jsonObjectToStringify),
                handler
            )
        );
    }

    private jsonBodyWrapperFor(jsonObjectToStringify:IJSONValue):IJSONValue {
        return {
            body: JSON.stringify(jsonObjectToStringify)
        }
    }

    private newFutureRestResponse(potentiallyFullOrPartialPath:string, nativeInvoker:INativeInvoker):IFuture<IRestResponse> {
        const url = this.fullPath(potentiallyFullOrPartialPath);
        return this.futures.newFuture((resolve, reject) => nativeInvoker(
            url,
            this.createNativeResponseHandler(url, resolve, reject)
        ));
    }

    private createNativeResponseHandler(url:string, resolve:(response:IRestResponse)=>any, reject:(error:IError)=>any):INativeServerResponseHandler {
        return (error:Error, response:INativeServerResponse) => {
            const responseWrapper = this.restForNodeJS.newRestResponse(error, response, url);
            if(responseWrapper.isError) reject(this.rest.newRestError(responseWrapper));
            else resolve(responseWrapper);
        }
    }

    private fullPath(potentiallyFullOrPartialPath:string):string {
        return potentiallyFullOrPartialPath.indexOf('://')>=0
            ? potentiallyFullOrPartialPath
            : `${this.baseUrl}${potentiallyFullOrPartialPath}`;
    }

    private request(method:Function, path:string, options?:INativeRequestOptions):IFuture<IRestResponse> {
        const url = this.fullPath(path);
        return this.futures.newFuture((resolve, reject) => {
            const responseHandler = (error, response, body) => {
                const responseWrapper = this.restForNodeJS.newRestResponse(error, response, url);
                if(responseWrapper.isError) reject(this.rest.newRestError(responseWrapper));
                else resolve(responseWrapper);
            };
            method.call(this.builtInNodeJSRequestor, url, options, responseHandler.bind(this));
        });
    }
}