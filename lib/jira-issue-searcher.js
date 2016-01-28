module.exports = function(api, jiraRestSession, jiraIssueSearchPath) {
    return {
        storyKeysForRelease: function(releaseName) {
            var _this = this;
            return api.newPromise(function(resolve, reject) {
                _this.jql(
                    'issuetype = Story AND fixVersion = '+releaseName,
                    'id,key'
                ).done(
                    function(responseJSONHash) {
                        var issues = responseJSONHash.issues
                        if(issues == undefined) reject(`no issues found for specified release: ${releaseName}`);
                        else resolve(issues.map(function(i) { return i.key; }));
                    },
                    reject
                );
            });
        },
        jql: function(jqlQueryText, fields) {
            return api.newPromise(function(resolve, reject) {
                jiraRestSession.newRequest().get(
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