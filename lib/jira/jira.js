"use strict";
var jira_rest_session_1 = require("./jira-rest-session");
var jira_rest_client_1 = require("./jira-rest-client");
var Jira = (function () {
    function Jira(jiraConfiguration, rest) {
        this.jiraConfiguration = jiraConfiguration;
        this.rest = rest;
    }
    Jira.prototype.newJiraRestSession = function (authedRestClient) {
        return new jira_rest_session_1.default(authedRestClient, this.jiraConfiguration);
    };
    Jira.prototype.newJiraRestClient = function () {
        return new jira_rest_client_1.default(this.rest, this.jiraConfiguration.jiraProtocolHostAndOptionalPort, this.jiraConfiguration.jiraRestSessionPath, this);
    };
    return Jira;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Jira;
//# sourceMappingURL=jira.js.map