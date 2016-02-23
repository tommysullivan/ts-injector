module.exports = function(api, authedRestClient, jiraIssueSearchPath, jql) {
    return {
        issueKeysForJQL: function(jql) {
            var _this = this;
            return api.newPromise((resolve, reject) => {
                _this.jsonForJQL(jql, 'id,key').done(responseJSONHash => {
                    var issues = responseJSONHash.issues;
                    if(issues == undefined) reject('no issues found for jql: '+jql);
                    else resolve(issues.map(i => i.key));
                }, reject);
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
            return api.newPromise((resolve, reject) => {
                authedRestClient.get(
                    jiraIssueSearchPath,
                    {
                        qs: {
                            jql: jqlQueryText,
                            fields: fields
                        }
                    }
                ).done(
                    response => resolve(JSON.parse(response.body)),
                    reject
                );
            });
        }
    }
}