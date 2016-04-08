import Framework from "../../lib/framework/framework";
declare var $:Framework;
declare var module:any;

module.exports = function() {
   this.When(/^I specify the query range start as "([^"]*)"$/, function (queryRangeStart) {
       this.queryRangeStart = queryRangeStart;
   });

   this.When(/^I query for the following metrics:$/, function (table) {
       this.metricNames = $.cucumber.getArrayFromTable(table);
       var metricGroupRequest = $.clusterUnderTest.newOpenTSDBRestClient()
           .then(c=>{
               return $.promiseFactory.newGroupPromise(
                   this.metricNames.map(metricName=>c.queryForMetric(this.queryRangeStart, metricName))
               );
           })
           .then(queryResultSets=>{
               this.queryResultSets = queryResultSets;
           });
       return $.expect(metricGroupRequest).to.eventually.be.fulfilled;
   });

   this.Then(/^I receive at least "([^"]*)" values per metric covering that time period$/, function (numExpectedValuesPerMetric) {
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
           throw new Error(errorMessages.join(';'));
       }
   });

    this.Then(/^those values may be incorrect but we are only testing for presence$/, function () {});

}