module.exports = function() {

    this.When(/^I query each ElasticSearch Server for logs for index "([^"]*)"$/, function (indexName, callback) {
        this.createInstallerRestSession()
            .then(installerRestSession => installerRestSession.services())
            .then(installerServices => {
                var elasticSearchHosts = installerServices.elasticSearch().hosts;
                var elasticSearchUrls = elasticSearchHosts.map(h=>`http://${h}:9200`);
                var elasticSearchRestClients = elasticSearchUrls.map(url => this.api.newElasticSearchRestClient(url));
                return this.api.newGroupPromise(elasticSearchRestClients.map(client => client.getLogsForIndex(indexName)));
            })
            .done(
                searchResults => { this.elasticSearchResults = searchResults; callback(); },
                error => callback(error.toString())
            );
    });

    this.Then(/^Each result has at least 1 log containing the word "([^"]*)"$/, function (soughtWord) {
        var resultStrings = this.elasticSearchResults.map(r=>JSON.stringify(r));
        var resultStringsMissingSoughtWord = resultStrings.filter(r=>r.indexOf(soughtWord)==-1);
        if(resultStringsMissingSoughtWord.length > 0) throw new Error(`Not all results contained matching word. Results: ${resultStringsMissingSoughtWord.join("\n")}`);
    });

}