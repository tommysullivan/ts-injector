"use strict";
var test_portal_web_server_1 = require("./test-portal-web-server");
var test_results_controller_1 = require("./controllers/test-results-controller");
var test_result_controller_1 = require("./controllers/test-result-controller");
var test_config_controller_1 = require("./controllers/test-config-controller");
var cli_invocations_controller_1 = require("./controllers/cli-invocations-controller");
var jira_sync_request_controller_1 = require("./controllers/jira-sync-request-controller");
var file_path_helper_1 = require("./models/file-path-helper");
var test_result_descriptor_1 = require("./models/test-result-descriptor");
var test_result_summary_model_1 = require("./models/test-result-summary-model");
var error_handler_1 = require("./controllers/error-handler");
var jql_query_controller_1 = require("./controllers/jql-query-controller");
var jira_test_result_comment_1 = require("./models/jira-test-result-comment");
var test_result_model_1 = require("./models/test-result-model");
var TestPortal = (function () {
    function TestPortal(testPortalConfiguration, expressWrappers, nodeWrapperFactory, jira, process, promiseFactory, collections, console) {
        this.testPortalConfiguration = testPortalConfiguration;
        this.expressWrappers = expressWrappers;
        this.nodeWrapperFactory = nodeWrapperFactory;
        this.jira = jira;
        this.process = process;
        this.promiseFactory = promiseFactory;
        this.collections = collections;
        this.console = console;
    }
    TestPortal.prototype.newTestResultModel = function (json) {
        return new test_result_model_1.default(json, this);
    };
    TestPortal.prototype.newFilePathHelper = function () {
        return new file_path_helper_1.default(this.testPortalConfiguration, this.nodeWrapperFactory.path);
    };
    TestPortal.prototype.newErrorHandler = function () {
        return new error_handler_1.default(this.console);
    };
    TestPortal.prototype.newTestPortalWebServer = function (jiraUsername, jiraPassword) {
        var fileSystem = this.nodeWrapperFactory.fileSystem();
        return new test_portal_web_server_1.default(this.expressWrappers, new test_results_controller_1.default(fileSystem, this.testPortalConfiguration.maxResultsForExplorer, this.nodeWrapperFactory.path, this.testPortalConfiguration.fullyQualifiedResultsPath, this), new test_result_controller_1.default(fileSystem, this.newFilePathHelper(), this.newErrorHandler()), new test_config_controller_1.default(fileSystem, this.newFilePathHelper()), new cli_invocations_controller_1.default(fileSystem, new file_path_helper_1.default(this.testPortalConfiguration, this.nodeWrapperFactory.path)), new jql_query_controller_1.default(this.jira.newJiraRestClient(), this.newErrorHandler(), this.jira, jiraUsername, jiraPassword), new jira_sync_request_controller_1.default(this.jira.newJiraRestClient(), this.promiseFactory, jiraUsername, jiraPassword, this.newErrorHandler(), this), this.testPortalConfiguration, this.nodeWrapperFactory.path);
    };
    TestPortal.prototype.newJiraTestResultComment = function (testResultModel) {
        return new jira_test_result_comment_1.default(testResultModel, this.collections);
    };
    TestPortal.prototype.newTestResultDescriptor = function (urlFriendlyName, fullPath, fileStats) {
        return new test_result_descriptor_1.default(urlFriendlyName, fullPath, fileStats);
    };
    TestPortal.prototype.newTestResultSummaryModel = function (summaryJSON) {
        return new test_result_summary_model_1.default(summaryJSON);
    };
    return TestPortal;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TestPortal;
//# sourceMappingURL=test-portal.js.map