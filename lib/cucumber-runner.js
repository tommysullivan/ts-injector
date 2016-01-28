module.exports = function(api, jiraIssueSearcher) {
    return {
        runCukesForJIRARelease: function(jiraReleaseName) {
            var _this = this;
            return api.newPromise(function(resolve, reject) {
                jiraIssueSearcher.storyKeysForRelease(jiraReleaseName).done(
                    function(issueKeys) {
                        var command = _this.runCukesForTags(issueKeys);
                        console.log('Run the following command to execute cucumber tests for release: '+jiraReleaseName);
                        console.log(command);
                        console.log('');
                        resolve(command);
                    },
                    reject
                );
            });
        },
        runCukesForTags: function(arrayOfTagNamesWithoutAtSymbol) {
            var tagsString = arrayOfTagNamesWithoutAtSymbol.map(function(s) { return '@'+s; }).join(',');
            var command = 'npm test -- --tags '+tagsString;
            return command;
        }
    }
}