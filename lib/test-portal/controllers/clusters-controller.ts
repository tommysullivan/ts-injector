import BaseExpressController from "../../express-wrappers/base-express-controller";
import IHttpRequest from "../../http/i-http-request";
import IHttpResponse from "../../http/i-http-response";

export default class ClustersController extends BaseExpressController {
    private clustersJSON:any;

    constructor(clustersJSON:any) {
        super();
        this.clustersJSON = clustersJSON;
    }

    get(httpRequest:IHttpRequest, httpResponse:IHttpResponse):void {
        httpResponse.end(JSON.stringify(this.clustersJSON));
    }
}