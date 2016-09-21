import {IRestResponse} from "./i-rest-response";
import {IFuture} from "../promise/i-future";

export interface IRestClientAsPromised {
    post(path:string, options?:any):IFuture<IRestResponse>;
    get(path:string, options?:any):IFuture<IRestResponse>;
    patch(path:string, options?:any):IFuture<IRestResponse>;
    delete(path:string, options?:any):IFuture<IRestResponse>;
    put(path:string, options?:any):IFuture<IRestResponse>;
}