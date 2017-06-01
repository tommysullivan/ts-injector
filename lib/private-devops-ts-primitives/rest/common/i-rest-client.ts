import {IRestResponse} from "./i-rest-response";
import {IFuture} from "../../futures/i-future";
import {IHash} from "../../collections/i-hash";
import {IJSONValue, IJSONHash} from "../../typed-json/i-json-value";
import {IRestRequestOptions} from "./i-rest-request-options";

export interface IRestClient {
    postFormEncodedBody(path:string, formKeyValuePairs:IHash<string>):IFuture<IRestResponse>;
    post(path:string, jsonObjectToStringify?:IJSONValue, options?:IRestRequestOptions):IFuture<IRestResponse>;
    postPlainText(path:string, postString:string):IFuture<IRestResponse>
    get(path:string, options?:IRestRequestOptions):IFuture<IRestResponse>;
    getPlainText(path:string):IFuture<IRestResponse>;
    getJSONWithSpecificContentType(path:string, contentType:string):IFuture<IRestResponse>;
    getWithQueryString(path:string, queryStringParams:IJSONHash):IFuture<IRestResponse>;
    delete(path:string):IFuture<IRestResponse>;
    put(path:string, jsonObjectToStringify:IJSONValue, options?:IRestRequestOptions):IFuture<IRestResponse>;
    patch(path:string, jsonObjectToStringify:IJSONValue, options?:IRestRequestOptions):IFuture<IRestResponse>;
}
