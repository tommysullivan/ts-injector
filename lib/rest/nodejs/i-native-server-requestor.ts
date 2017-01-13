import {INativeRequestOptions} from "./i-request-options";
import {INativeServerResponseHandler} from "./i-native-server-response-handler";

export interface INativeServerRequestor {
    post(url:string, options:INativeRequestOptions, responseHandler:INativeServerResponseHandler):void;
    get(url:string, options:INativeRequestOptions, responseHandler:INativeServerResponseHandler):void;
    patch(url:string, options:INativeRequestOptions, responseHandler:INativeServerResponseHandler):void;
    delete(url:string, responseHandler:INativeServerResponseHandler):void;
    put(url:string, options:INativeRequestOptions, responseHandler:INativeServerResponseHandler):void;
}