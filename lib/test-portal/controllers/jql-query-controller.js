"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var base_express_controller_1 = require("../../express-wrappers/base-express-controller");
var JQLQueryController = (function (_super) {
    __extends(JQLQueryController, _super);
    function JQLQueryController(jiraRestClient, errorHandler, jira, jiraUsername, jiraPassword) {
        _super.call(this);
        this.jiraRestClient = jiraRestClient;
        this.errorHandler = errorHandler;
        this.jira = jira;
        this.jiraUsername = jiraUsername;
        this.jiraPassword = jiraPassword;
    }
    JQLQueryController.prototype.post = function (httpRequest, httpResponse) {
        var _this = this;
        this.jiraRestClient.createAutheticatedSession(this.jiraUsername, this.jiraPassword)
            .then(function (jiraSession) { return jiraSession.issueKeysForJQL(httpRequest.body); })
            .then(function (issueKeysForJQL) { return httpResponse.end(issueKeysForJQL.toJSON()); })
            .catch(function (error) { return _this.errorHandler.handleError(httpResponse, error); });
    };
    return JQLQueryController;
}(base_express_controller_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = JQLQueryController;
//# sourceMappingURL=jql-query-controller.js.map