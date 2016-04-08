"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var base_express_controller_1 = require("../../express-wrappers/base-express-controller");
var JIRASyncRequestController = (function (_super) {
    __extends(JIRASyncRequestController, _super);
    function JIRASyncRequestController(jiraRestClient, promiseFactory, jiraUsername, jiraPassword, errorHandler, testPortal) {
        _super.call(this);
        this.jiraRestClient = jiraRestClient;
        this.promiseFactory = promiseFactory;
        this.jiraUsername = jiraUsername;
        this.jiraPassword = jiraPassword;
        this.errorHandler = errorHandler;
        this.testPortal = testPortal;
    }
    JIRASyncRequestController.prototype.post = function (httpRequest, httpResponse) {
        var _this = this;
        var testResultModels = httpRequest.bodyAsListOfJSONObjects.map(function (testResultJSON) { return _this.testPortal.newTestResultModel(testResultJSON); });
        var testResultComments = testResultModels.map(function (testResultModel) { return _this.testPortal.newJiraTestResultComment(testResultModel); });
        this.jiraRestClient.createAutheticatedSession(this.jiraUsername, this.jiraPassword)
            .then(function (jiraSession) {
            var commentCreationRequests = testResultComments.map(function (testResultComment) { return jiraSession.addCommentToIssue(testResultComment); });
            return _this.promiseFactory.newGroupPromise(commentCreationRequests);
        })
            .then(function (_) { return httpResponse.end('success'); })
            .catch(function (error) { return _this.errorHandler.handleError(httpResponse, error); });
    };
    return JIRASyncRequestController;
}(base_express_controller_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = JIRASyncRequestController;
//# sourceMappingURL=jira-sync-request-controller.js.map