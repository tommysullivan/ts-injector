"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var base_express_controller_1 = require("../../express-wrappers/base-express-controller");
var CliInvocationsController = (function (_super) {
    __extends(CliInvocationsController, _super);
    function CliInvocationsController(fs, filePathHelper) {
        _super.call(this);
        this.fs = fs;
        this.filePathHelper = filePathHelper;
    }
    CliInvocationsController.prototype.get = function (httpRequest, httpResponse) {
        this.fs.createReadStream(this.filePathHelper.getTestCliInvocationsFilePathFromHttpRequest(httpRequest)).pipe(httpResponse);
    };
    return CliInvocationsController;
}(base_express_controller_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CliInvocationsController;
//# sourceMappingURL=cli-invocations-controller.js.map