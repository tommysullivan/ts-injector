"use strict";
var JiraRestClient = (function () {
    function JiraRestClient(rest, jiraProtocolHostAndOptionalPort, jiraRestSessionPath, jira) {
        this.rest = rest;
        this.jiraProtocolHostAndOptionalPort = jiraProtocolHostAndOptionalPort;
        this.jiraRestSessionPath = jiraRestSessionPath;
        this.jira = jira;
    }
    JiraRestClient.prototype.createAutheticatedSession = function (username, password) {
        var _this = this;
        var restClientAsPromised = this.rest.newRestClientAsPromised(this.jiraProtocolHostAndOptionalPort);
        var postPayload = {
            body: {
                username: username,
                password: password
            },
            json: true
        };
        return restClientAsPromised.post(this.jiraRestSessionPath, postPayload)
            .then(function (_) { return _this.jira.newJiraRestSession(restClientAsPromised); });
    };
    return JiraRestClient;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = JiraRestClient;
//# sourceMappingURL=jira-rest-client.js.map