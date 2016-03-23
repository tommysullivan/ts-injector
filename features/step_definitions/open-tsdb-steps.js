var _ = require('underscore');

module.exports = function() {

    this.When(/^I specify the query range start as "([^"]*)"$/, function (queryRangeStart) {
        this.queryRangeStart = queryRangeStart;
    });

    this.When(/^I query for the following metrics:$/, function (table, callback) {
        this.metricNames = this.getArrayFromTable(table);

        this.createInstallerRestSession()
            .then(installerRestSession => installerRestSession.services())
            .then(services => {
                var openTSDBHosts = services.openTSDB().hosts;
                var openTSDBUrls = openTSDBHosts.map(h=>`http://${h}:4242`);
                if(openTSDBUrls.length==0) throw new Error(`No OpenTSDB hosts were dicovered. services: ${services.toString()}`)
                var openTSDBRestClients = openTSDBUrls.map(u=>this.api.newOpenTSDBRestClient(u));
                var allPromises = _.flatten(
                    openTSDBRestClients.map(
                        c=>this.metricNames.map(
                            m=>c.queryForMetric(this.queryRangeStart, m)
                                .then(c=>{console.log(c.toString()); return c;})
                        )
                    )
                );
                return this.api.newGroupPromise(allPromises)
            })
            .done(
                queryResultSets => { this.queryResultSets = queryResultSets; callback(); },
                error => callback(error.toString())
            );
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