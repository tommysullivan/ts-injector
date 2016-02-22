module.exports = function(api, authedRestClient, jiraIssueSearchPath, jql) {
    return {
        issueKeysForJQL: jql => {
            return api.newPromise((resolve, reject) => {
                this.jsonForJQL(jql, 'id,key').done(responseJSONHash => {
                    var issues = responseJSONHash.issues;
                    if(issues == undefined) reject('no issues found for jql: '+jql);
                    else resolve(issues.map(i => i.key));
                }, reject);
            });
        },
        addCommentToIssue: (issueKey, comment) => {
            var url = `/rest/api/2/issue/${issueKey}/comment`;
            var commentBody = {
                body: {
                    "body": comment,
                    //"visibility": {
                    //    "type": "role",
                    //    "value": "Administrators"
                    //}
                },
                json: true
            }
            return authedRestClient.post(url, commentBody);
        },
        jsonForJQL: (jqlQueryText, fields) => {
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