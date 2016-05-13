"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var base_express_controller_1 = require("../../express-wrappers/base-express-controller");
var TestResultController = (function (_super) {
    __extends(TestResultController, _super);
    function TestResultController(fs, filePathHelper, errorHandler) {
        _super.call(this);
        this.contentTypeThatTransformsToDesiredContentType = 'vnd/mapr.test-portal.cluster-test-result+json;v=2.0.0';
        this.fs = fs;
        this.filePathHelper = filePathHelper;
        this.errorHandler = errorHandler;
    }
    TestResultController.prototype.get = function (httpRequest, httpResponse) {
        if (httpRequest.accepts('text/html'))
            httpResponse.redirect("/#/test-result-viewer/" + httpRequest.params.getOrThrow('resultId'));
        else {
            var filePath = this.filePathHelper.getTestResultFilePathFromHttpRequest(httpRequest);
            if (this.shouldAttemptTransform(httpRequest, filePath)) {
                this.getTestResultSummary(httpRequest, httpResponse, filePath);
            }
            else {
                this.fs.createReadStream(this.filePathHelper.getTestResultFilePathFromHttpRequest(httpRequest)).pipe(httpResponse);
            }
        }
    };
    TestResultController.prototype.shouldAttemptTransform = function (httpRequest, filePath) {
        if (httpRequest.accepts('vnd/mapr.test-portal.cluster-test-result-summary+json;v=1.0.0')) {
            var testResultJSON = this.fs.readJSONObjectFileSync(filePath);
            var hasContentType = testResultJSON.hasPropertyNamed('contentType');
            var canTransformToContentType = testResultJSON.stringPropertyNamed('contentType') == this.contentTypeThatTransformsToDesiredContentType;
            return canTransformToContentType;
        }
        else
            return false;
    };
    TestResultController.prototype.getTestResultSummary = function (httpRequest, httpResponse, filePath) {
        var testResultJSON = this.fs.readJSONObjectFileSync(filePath);
        var transformedTestResultJSON = {
            contentType: testResultJSON.stringPropertyNamed('contentType'),
            clusterConfiguration: {
                id: testResultJSON.jsonObjectNamed('clusterConfiguration').stringPropertyNamed('id')
            },
            cucumberTestResult: {
                cucumberFeatureResults: testResultJSON.hasPropertyNamed('cucumberTestResult')
                    ? testResultJSON.jsonObjectNamed('cucumberTestResult').listNamed('cucumberFeatureResults').toArray()
                    : []
            }
        };
        httpResponse.end(JSON.stringify(transformedTestResultJSON));
    };
    TestResultController.prototype.put = function (httpRequest, httpResponse) {
        try {
            this.fs.writeFileSync(this.filePathHelper.getTestResultFilePathFromHttpRequest(httpRequest), httpRequest.bodyAsJSONObject.toString());
            httpResponse.sendStatus(200).end('Successfully saved test result');
        }
        catch (error) {
            this.errorHandler.handleError(httpResponse, error);
        }
    };
    return TestResultController;
}(base_express_controller_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TestResultController;
//# sourceMappingURL=test-result-controller.js.map