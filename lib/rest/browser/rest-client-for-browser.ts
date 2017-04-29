import {IRestClient} from "../common/i-rest-client";
import {IFutures} from "../../futures/i-futures";
import {IFuture} from "../../futures/i-future";
import {IRestResponse} from "../common/i-rest-response";
import {IHash} from "../../collections/i-hash";
import {IJSONValue, IJSONHash} from "../../typed-json/i-json-value";
import {NotImplementedError} from "../../errors/not-implemented-error";
import {IRestRequestOptions} from "../common/i-rest-request-options";
import {IJQueryXHR} from "./i-jquery-xhr";

export class RestClientForBrowser implements IRestClient {
    constructor(
        private futures:IFutures,
        private $:any,
        private newRestResponse:(nativeJQueryResponseBody:string, originalURL:string, xhr:IJQueryXHR)=>IRestResponse
    ) {}

    postFormEncodedBody(path: string, formKeyValuePairs: IHash<string>): IFuture<IRestResponse> {
        throw new NotImplementedError();
    }

    get(path: string, options?:IRestRequestOptions): IFuture<IRestResponse> {
        const headers = options && options.headers ? options.headers : { Accept: "application/json" };
        return this.futures.newFuture((resolve, reject) => {
            this.$.ajax({ url: path, type: 'GET', headers: headers })
                .then((data, status, xhr) => resolve(this.newRestResponse(data, path, xhr)))
                .fail(e => reject(e));
        });
    }

    getPlainText(path: string): IFuture<IRestResponse> {
        throw new NotImplementedError();
    }

    getWithQueryString(path: string, queryStringParams: IJSONHash): IFuture<IRestResponse> {
        throw new NotImplementedError();
    }

    patch(path: string, jsonObjectToStringify: IJSONValue, options?:IRestRequestOptions): IFuture<IRestResponse> {
        throw new NotImplementedError();
    }

    getJSONWithSpecificContentType(path:string, contentType:string):IFuture<IRestResponse> {
        return this.futures.newFuture((resolve, reject) => {
            const ajaxArgs = {
                headers: {
                    Accept: contentType
                },
                url: path,
            };
            this.$.ajax(ajaxArgs)
                .then((data, status, xhr) => resolve(this.newRestResponse(data, path, xhr)))
                .fail(e => reject(e));
        });
    }

    delete(path:string):IFuture<IRestResponse> {
        return this.futures.newFuture((resolve, reject) => {
            this.$.ajax({ url: path, type: 'DELETE' })
                .then((data, status, xhr) => resolve(this.newRestResponse(data, path, xhr)))
                .fail(e => reject(e));
        });
    }

    put(path:string, json:IJSONValue, options?:IRestRequestOptions):IFuture<IRestResponse> {
        return this.futures.newFuture((resolve, reject) => {
            this.$.ajax({ url: path, data: JSON.stringify(json), type: 'PUT', headers: options ? options.headers : null })
                .then((data, status, xhr) => resolve(this.newRestResponse(data, path, xhr)))
                .fail(e => reject(e));
        });
    }

    post(path:string, json:IJSONValue, options?:IRestRequestOptions):IFuture<IRestResponse> {
        return this.futures.newFuture((resolve, reject) => {
            this.$.ajax({ url: path, data: JSON.stringify(json), type: 'POST', headers: options ? options.headers : null })
                .then((data, status, xhr) => resolve(this.newRestResponse(data, path, xhr)))
                .fail(e => reject(e));
        });
    }

    postPlainText(path: string, postString: string): IFuture<IRestResponse> {
        throw new NotImplementedError();
    }
}