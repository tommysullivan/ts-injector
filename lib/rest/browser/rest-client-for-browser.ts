import {IRestClient} from "../common/i-rest-client";
import {IFutures} from "../../futures/i-futures";
import {IFuture} from "../../futures/i-future";
import {IRestResponse} from "../common/i-rest-response";
import {IHash} from "../../collections/i-hash";
import {IJSONValue, IJSONHash} from "../../typed-json/i-json-value";
import {IJSONParser} from "../../typed-json/i-json-parser";

export class RestClientForBrowser implements IRestClient {
    constructor(
        private futures:IFutures,
        private $:any,
        private jsonParser:IJSONParser,
        private newRestResponse:(nativeJQueryResponseBody:string, originalURL:string)=>IRestResponse
    ) {}

    postFormEncodedBody(path: string, formKeyValuePairs: IHash<string>): IFuture<IRestResponse> {
        throw new Error('not implemented');
    }

    get(path: string): IFuture<IRestResponse> {
        return this.getJSONWithSpecificContentType(path, "application/json");
    }

    getPlainText(path: string): IFuture<IRestResponse> {
        throw new Error('not impl');
    }

    getWithQueryString(path: string, queryStringParams: IJSONHash): IFuture<IRestResponse> {
        throw new Error('not impl');
    }

    patch(path: string, jsonObjectToStringify: IJSONValue): IFuture<IRestResponse> {
        throw new Error('not impl');
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
                .then(r => resolve(this.newRestResponse(r, path)))
                .fail(e => reject(e));
        });
    }

    delete(path:string):IFuture<IRestResponse> {
        return this.futures.newFuture((resolve, reject) => {
            this.$.ajax({ url: path, type: 'DELETE' })
                .then(r => resolve(this.newRestResponse(r, path)))
                .fail(e => reject(e));
        });
    }

    put(path:string, json:IJSONValue):IFuture<IRestResponse> {
        return this.futures.newFuture((resolve, reject) => {
            this.$.ajax({ url: path, data: JSON.stringify(json), type: 'PUT' })
                .then(r => resolve(this.newRestResponse(r, path)))
                .fail(e => reject(e));
        });
    }

    post(path:string, json:IJSONValue):IFuture<IRestResponse> {
        return this.futures.newFuture((resolve, reject) => {
            this.$.ajax({ url: path, data: JSON.stringify(json), type: 'POST' })
                .then(r => resolve(this.newRestResponse(r, path)))
                .fail(e => reject(e));
        });
    }
}