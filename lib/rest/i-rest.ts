import {IRestClientAsPromised} from "./i-rest-client-as-promised";
import {IRestResponse} from "./i-rest-response";
import {IError} from "../errors/i-error";

export interface IRest {
    newRestClientAsPromised(baseURL?:string):IRestClientAsPromised;
    newJSONRequestorWithCookies():any;
    newRestResponse(error:any, nativeResponse:any, originalURL:string):IRestResponse;
    newRestError(restResponse:IRestResponse):IError;
}