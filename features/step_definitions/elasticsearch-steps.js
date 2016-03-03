module.exports = function() {
    this.When(/^I query for logs for index "([^"]*)"$/, function (indexName, callback) {
        var elasticSearchRestClient = this.api.newElasticSearchRestClient(this.elasticSearchHostAndOptionalPort);
        var promise = elasticSearchRestClient.getLogsForIndex(indexName);
        promise.done(
            (elasticSearchResult) => {
                this.elasticSearchResult = elasticSearchResult;
                callback();
            },
            callback
        );
    });

    this.Then(/^I see at least a single log containing the word "([^"]*)"/, function (searchWord, callback) {
        if(JSON.stringify(this.elasticSearchResult).indexOf(searchWord)==-1) callback("no logs found for word: "+searchWord+". Results: "+JSON.stringify(this.elasticSearchResult));
        else callback();
    });

}