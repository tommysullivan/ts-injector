module.exports = function(api, authedRestClient, jiraIssueSearchPath, jql) {
    return {
        issueKeysForJQL: function(jql) {
            return this.jsonForJQL(jql, 'id,key')
                .then(responseJSONHash => {
                    var issues = responseJSONHash.issues;
                    if(issues == undefined) throw new Error(`no issues found for jql: ${jql}`);
                    return issues.map(i => i.key);
                });
        },
        addCommentToIssue: function(issueKey, comment) {
            var url = `/rest/api/2/issue/${issueKey}/comment`;
            var commentBody = {
                body: {
                    "body": comment
                },
                json: true
            }
            return authedRestClient.post(url, commentBody);
        },
        jsonForJQL: function(jqlQueryText, fields) {
            var queryOptions = {
                qs: {
                    jql: jqlQueryText,
                    fields: fields
                }
            }
            return authedRestClient.get(jiraIssueSearchPath,queryOptions)
                .then(response => response.jsonBody());
        }
    }
}