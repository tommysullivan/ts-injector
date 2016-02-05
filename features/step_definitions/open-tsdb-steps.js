module.exports = function() {

    this.Given(/^the URL and port of OpenTSDB is "([^"]*)"$/, function (openTSDBHostAndPort) {
        this.openTSDBRestClient = this.api.newOpenTSDBRestClient(openTSDBHostAndPort);
    });

    this.When(/^I specify the query range start as "([^"]*)"$/, function (queryRangeStart) {
        this.queryRangeStart = queryRangeStart;
    });

    this.When(/^I query for the following metrics:$/, function (table, callback) {
        var self = this;
        this.metricNames = this.getArrayFromTable(table);
        var metricQueryPromises = this.metricNames.map(function(metricName) {
            return self.openTSDBRestClient.queryForMetric(self.queryRangeStart, metricName);
        });
        var groupQuery = this.api.newGroupPromise(metricQueryPromises);
        groupQuery.done(
            function(queryResultSets) {
                self.queryResultSets = queryResultSets;
                callback();
            },
            function(error) {
                callback("There was an error: "+error.statusCode);
            }
        )
    });

    this.Then(/^I receive at least "([^"]*)" values per metric covering that time period$/, function (numExpectedValuesPerMetric, callback) {
        numExpectedValuesPerMetric = parseInt(numExpectedValuesPerMetric);
        function getTimestampsForQueryResultSet(queryResultSet) {
            return Object.keys(queryResultSet[0].dps);
        }
        var insufficientQueryResultSets = this.queryResultSets.filter(function(queryResultSet) {
            //console.log(JSON.stringify(queryResultSet[0].metric));
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