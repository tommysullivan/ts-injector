import IHttpResponse from "../http/i-http-response";
import IHttpRequest from "../http/i-http-request";

interface IExpressController {
    get(httpRequest:IHttpRequest, httpResponse:IHttpResponse):void;
    put(httpRequest:IHttpRequest, httpResponse:IHttpResponse):void;
    post(httpRequest:IHttpRequest, httpResponse:IHttpResponse):void;
    delete(httpRequest:IHttpRequest, httpResponse:IHttpResponse):void;
}

export default IExpressController;