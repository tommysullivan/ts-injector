"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var base_express_controller_1 = require("../../express-wrappers/base-express-controller");
var ClustersController = (function (_super) {
    __extends(ClustersController, _super);
    function ClustersController(clustersJSON) {
        _super.call(this);
        this.clustersJSON = clustersJSON;
    }
    ClustersController.prototype.get = function (httpRequest, httpResponse) {
        httpResponse.end(JSON.stringify(this.clustersJSON));
    };
    return ClustersController;
}(base_express_controller_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ClustersController;
//# sourceMappingURL=clusters-controller.js.map