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
import {IHash} from "../../collections/i-hash";
import {IJSONValue, IJSONHash} from "../../typed-json/i-json-value";
import {IRestRequestOptions} from "../common/i-rest-request-options";

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
                this.createNativeRequestOptions(jsonObjectToStringify),
                handler
            )
        );
    }

    postPlainText(path:string, postString:string):IFuture<IRestResponse> {
        return this.newFutureRestResponse(
            path,
            (url, handler) => this.builtInNodeJSRequestor.post(
                url,
                this.createNativeTextRequestOptions(postString),
                handler
            )
        );
    }

    getWithQueryString(path:string, queryStringParams:IJSONHash):IFuture<IRestResponse> {
        return this.get(path, {
            queryString: queryStringParams
        });
    }

    getPlainText(path: string): IFuture<IRestResponse> {
        return this.get(path, {
            headers: {
                Accept: 'text/plain'
            }
        });
    }

    getJSONWithSpecificContentType(path:string, contentType:string):IFuture<IRestResponse> {
        return this.get(path, {
            headers: {
                'Content-Type': contentType
            }
        });
    }

    get(path:string, options?:IRestRequestOptions):IFuture<IRestResponse> {
        return this.newFutureRestResponse(
            path,
            (url, handler) => this.builtInNodeJSRequestor.get(
                url,
                this.createNativeRequestOptions(null, options),
                handler
            )
        );
    }

    patch(path:string, jsonObjectToStringify?:IJSONValue):IFuture<IRestResponse> {
        return this.newFutureRestResponse(
            path,
            (url, handler) => this.builtInNodeJSRequestor.patch(
                url,
                this.createNativeRequestOptions(jsonObjectToStringify),
                handler
            )
        );
    }

    delete(path:string):IFuture<IRestResponse> {
        //TODO: Will delete also need options?
        return this.newFutureRestResponse(
            path,
            (url, handler) => this.builtInNodeJSRequestor.delete(url, handler)
        );
    }

    put(path:string, jsonObjectToStringify:IJSONValue, options?:IRestRequestOptions):IFuture<IRestResponse> {
        return this.newFutureRestResponse(
            path,
            (url, handler) => this.builtInNodeJSRequestor.put(
                url,
                this.createNativeRequestOptions(jsonObjectToStringify, options),
                handler
            )
        );
    }

    private jsonBodyWrapperFor(jsonObjectToStringify:IJSONValue):IJSONValue {
        return {
            body: JSON.stringify(jsonObjectToStringify)
        }
    }

    private createNativeRequestOptions(requestBody:IJSONValue, options?:IRestRequestOptions):INativeRequestOptions {
        return {
            body: requestBody ? JSON.stringify(requestBody) : null,
            headers: options ? options.headers : undefined,
            qs: options ? options.queryString : null
        }
    }

    private createNativeTextRequestOptions(requestBody:string, options?:IRestRequestOptions):INativeRequestOptions {
        return {
            body: requestBody ? requestBody : null,
            headers: options ? options.headers : `Content-Type: text/plain`,
            qs: options ? options.queryString : null
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