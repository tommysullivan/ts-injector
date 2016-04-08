import IHttpRequest from "../http/i-http-request";

export default class ExpressHttpRequest implements IHttpRequest {
    accepts(contentType:string):boolean {
        return null;
    }
}