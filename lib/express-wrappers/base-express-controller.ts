import IExpressController from "./i-express-controller";
import IHttpRequest from "../http/i-http-request";
import IHttpResponse from "../http/i-http-response";

export default class BaseExpressController implements IExpressController {

    get(httpRequest:IHttpRequest, httpResponse:IHttpResponse):void {
    }

    put(httpRequest:IHttpRequest, httpResponse:IHttpResponse):void {
    }

    post(httpRequest:IHttpRequest, httpResponse:IHttpResponse):void {
    }

    delete(httpRequest:IHttpRequest, httpResponse:IHttpResponse):void {
    }
}