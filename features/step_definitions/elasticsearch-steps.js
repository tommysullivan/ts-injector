module.exports = function() {
    this.Given(/^I have an ES server running at "([^"]*)"$/, function (elasticSearchHostAndOptionalPort) {
        this.elasticSearchHostAndOptionalPort = elasticSearchHostAndOptionalPort;
    });

    this.When(/^I query for logs for index "([^"]*)"$/, function (indexName, callback) {
        this.api.newElasticSearchRestClient(this.elasticSearchHostAndOptionalPort).getLogsForIndex(indexName).done(
            elasticSearchResult => {
                this.elasticSearchResult = elasticSearchResult;
                callback();
            },
            callback
        )
    });

    this.Then(/^I see at least a single log containing the word "([^"]*)"/, function (searchWord, callback) {
        if(JSON.stringify(this.elasticSearchResult).indexOf(searchWord)==-1) callback("no logs found for word: "+searchWord+". Results: "+JSON.stringify(this.elasticSearchResult));
        else callback();
    });

}