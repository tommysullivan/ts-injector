"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var base_express_controller_1 = require("../../express-wrappers/base-express-controller");
var ClustersRevertRequestsController = (function (_super) {
    __extends(ClustersRevertRequestsController, _super);
    function ClustersRevertRequestsController(clusterTesting) {
        _super.call(this);
        this.clusterTesting = clusterTesting;
    }
    ClustersRevertRequestsController.prototype.post = function (httpRequest, httpResponse) {
        this.clusterTesting.esxiManagedClusterForId(httpRequest.bodyAsJSONObject.stringPropertyNamed('clusterid')).revertToState('readyForUpgrade')
            .then(function (_) { return httpResponse.end(); })
            .catch(function (_) { return httpResponse.sendStatus(500); });
    };
    return ClustersRevertRequestsController;
}(base_express_controller_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ClustersRevertRequestsController;
//# sourceMappingURL=cluster-revert-requests-controller.js.map