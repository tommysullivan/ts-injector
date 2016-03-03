module.exports = function() {

    this.When(/^I specify the query range start as "([^"]*)"$/, function (queryRangeStart) {
        this.queryRangeStart = queryRangeStart;
    });

    this.When(/^I query for the following metrics:$/, function (table, callback) {
        this.metricNames = this.getArrayFromTable(table);
        var openTSDBRestClient = this.api.newOpenTSDBRestClient(this.openTSDBHostAndPort);
        var metricQueryPromises = this.metricNames.map(metricName => openTSDBRestClient.queryForMetric(this.queryRangeStart, metricName));
        this.api.newGroupPromise(metricQueryPromises).done(
            queryResultSets => { this.queryResultSets = queryResultSets; callback(); },
            error => callback("There was an http error: "+error)
        )
    });

    this.Then(/^I receive at least "([^"]*)" values per metric covering that time period$/, function (numExpectedValuesPerMetric, callback) {
        numExpectedValuesPerMetric = parseInt(numExpectedValuesPerMetric);
        function getTimestampsForQueryResultSet(queryResultSet) {
            return Object.keys(queryResultSet[0].dps);
        }
        var insufficientQueryResultSets = this.queryResultSets.filter(function(queryResultSet) {
            var timestamps = getTimestampsForQueryResultSet(queryResultSet);
            return timestamps.length < numExpectedValuesPerMetric;
        });
        if(insufficientQueryResultSets.length>0) {
            var errorMessages = insufficientQueryResultSets.map(function(insufficientQueryResultSet) {
                return insufficientQueryResultSet[0].metric
                    + " had only "
                    + getTimestampsForQueryResultSet(insufficientQueryResultSet).length
                    + " metric values";
            });
            callback("Insufficient metrics. "+errorMessages.join("; "));
        }
        else callback();
    });

}