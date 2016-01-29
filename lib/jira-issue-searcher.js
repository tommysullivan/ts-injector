module.exports = function(api, authenticatedRestSession, jiraIssueSearchPath, jql) {
    return {
        issueKeysForJQL: function(jql) {
            var _this = this;
            return api.newPromise(function(resolve, reject) {
                _this.jsonForJQL(jql, 'id,key').done(function(responseJSONHash) {
                    var issues = responseJSONHash.issues;
                    if(issues == undefined) reject(`no issues found for jql: `+jql);
                    else resolve(issues.map(function(i) { return i.key; }));
                }, reject);
            });
        },
        jsonForJQL: function(jqlQueryText, fields) {
            return api.newPromise(function(resolve, reject) {
                authenticatedRestSession.newRequest().get(
                    jiraIssueSearchPath,
                    {
                        qs: {
                            jql: jqlQueryText,
                            fields: fields
                        }
                    }
                ).done(
                    function(response) {
                        resolve(JSON.parse(response.body));
                    },
                    reject
                );
            });
        }
    }
}