"use strict";
var JiraRestSession = (function () {
    function JiraRestSession(authedRestClient, jiraConfiguration) {
        this.authedRestClient = authedRestClient;
        this.jiraConfiguration = jiraConfiguration;
    }
    JiraRestSession.prototype.issueKeysForJQL = function (jqlQuery) {
        return this.jsonForJQL(jqlQuery, ['id', 'key'])
            .then(function (responseJSONObject) {
            return responseJSONObject.listOfJSONObjectsNamed('issues')
                .map(function (i) { return i.stringPropertyNamed('key'); });
        });
    };
    JiraRestSession.prototype.addCommentToIssue = function (comment) {
        var url = this.jiraConfiguration.commentPathTemplate.replace('{issueKey}', comment.issueKey);
        var postOptions = {
            body: {
                body: comment.text
            },
            json: true
        };
        return this.authedRestClient.post(url, postOptions);
    };
    JiraRestSession.prototype.jsonForJQL = function (jqlQueryText, fields) {
        var queryOptions = {
            qs: {
                jql: jqlQueryText,
                fields: fields.join(',')
            }
        };
        return this.authedRestClient.get(this.jiraConfiguration.jiraIssueSearchPath, queryOptions)
            .then(function (response) { return response.bodyAsJsonObject(); });
    };
    return JiraRestSession;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = JiraRestSession;
//# sourceMappingURL=jira-rest-session.js.map