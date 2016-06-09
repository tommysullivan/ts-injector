import BaseExpressController from "../../express-wrappers/base-express-controller";
import IHttpRequest from "../../http/i-http-request";
import IHttpResponse from "../../http/i-http-response";
import ClusterTesting from "../../cluster-testing/cluster-testing";

export default class ClustersRevertRequestsController extends BaseExpressController {
    private clusterTesting:ClusterTesting;

    constructor(clusterTesting:ClusterTesting) {
        super();
        this.clusterTesting = clusterTesting;
    }

    post(httpRequest:IHttpRequest, httpResponse:IHttpResponse):void {
        this.clusterTesting.esxiManagedClusterForId(httpRequest.bodyAsJSONObject.stringPropertyNamed('clusterid')).revertToState('readyForUpgrade')
            .then(_ => httpResponse.end())
            .catch(_ => httpResponse.sendStatus(500));
    }
}