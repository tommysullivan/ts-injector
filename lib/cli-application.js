module.exports = function(api, configJSON) {
    return {
        execute: function(argv) {
            var loadedConfiguration = null;
            api.newConfigurationProvider().getConfiguration(argv)
                .then(function(configuration) {
                    loadedConfiguration = configuration;
                    return api.newJiraRestClient().createAutheticatedSession(loadedConfiguration.username, loadedConfiguration.password);
                }).then(function(authenticatedRestSession) {
                var preconfiguredJQLQuery = configJSON.jqlQueries[loadedConfiguration.jql];
                var jql = preconfiguredJQLQuery == null ? loadedConfiguration.jql : preconfiguredJQLQuery;
                return api.newJiraIssueSearcher(authenticatedRestSession).issueKeysForJQL(jql)
            }).then(function(arrayOfTagNamesWithoutAtSymbol) {
                api.newCucumberRunner().runCukesForTags(arrayOfTagNamesWithoutAtSymbol);
            }).done(null, console.log.bind(console));
        }
    }
}