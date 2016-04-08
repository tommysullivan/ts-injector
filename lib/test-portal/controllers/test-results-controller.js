"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var base_express_controller_1 = require("../../express-wrappers/base-express-controller");
var TestResultsController = (function (_super) {
    __extends(TestResultsController, _super);
    function TestResultsController(fs, maxResults, path, fullyQualifiedResultsPath, testPortal) {
        _super.call(this);
        this.fs = fs;
        this.maxResults = maxResults;
        this.path = path;
        this.fullyQualifiedResultsPath = fullyQualifiedResultsPath;
        this.testPortal = testPortal;
    }
    TestResultsController.prototype.get = function (httpRequest, httpResponse) {
        var _this = this;
        var fileNames = this.fs.readdirSync(this.fullyQualifiedResultsPath).filter(function (f) { return f.indexOf('.json') > -1; });
        var fileDescriptors = fileNames.map(function (fileName) {
            var fullPath = _this.path.join(_this.fullyQualifiedResultsPath, fileName);
            var urlFriendlyName = fileName.replace('.json', '');
            var fileStats = _this.fs.statSync(fullPath);
            return _this.testPortal.newTestResultDescriptor(urlFriendlyName, fullPath, fileStats);
        });
        fileDescriptors = fileDescriptors.filter(function (f) { return f.size > 0; });
        fileDescriptors = fileDescriptors.sortWith(function (f1, f2) { return f1.modifiedTime - f2.modifiedTime; });
        fileDescriptors = fileDescriptors.limitTo(this.maxResults);
        httpResponse.end(fileDescriptors.toJSONString());
    };
    return TestResultsController;
}(base_express_controller_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TestResultsController;
//# sourceMappingURL=test-results-controller.js.map