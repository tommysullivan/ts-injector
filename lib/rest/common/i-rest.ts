import {IRestClient} from "./i-rest-client";
import {IRestResponse} from "./i-rest-response";
import {IError} from "../../errors/i-error";

export interface IRest {
    newRestClient(baseURL?:string):IRestClient;
    newRestError(restResponse:IRestResponse):IError;
}