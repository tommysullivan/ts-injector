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

    this.When(/^I query for the following metrics using tags:$/, function (table) {
        this.metricNames = $.cucumber.getArrayFromTable(table);
        var metricGroupRequest = $.clusterUnderTest.newOpenTSDBRestClient()
            .then(c=>{
                return $.promiseFactory.newGroupPromise(
                    this.metricNames.map(metricName=>c.queryForMetricWithTags(this.queryRangeStart, metricName,this.tagList))
                );
            })
            .then(queryResultSets=>{
                this.queryResultSets = queryResultSets;
            });
        return $.expect(metricGroupRequest).to.eventually.be.fulfilled;
    });

    this.When(/^I query for each volume using tag key "([^"]*)" and tag value as the name of the volume$/, function (tagKey){
        this.tagKey=tagKey;
        this.tagValue=this.volumeName;
        this.tagList="{"+this.tagKey+"="+this.tagValue+"}";
    });


    function getTimestampsForQueryResultSet(queryResultSet) {
        return Object.keys(queryResultSet[0].dps);
    }
    this.Then(/^I receive at least "([^"]*)" values per metric covering that time period$/, function (numExpectedValuesPerMetric) {
       numExpectedValuesPerMetric = parseInt(numExpectedValuesPerMetric);
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
        var queryResultSet=this.queryResultSets.first();
        var timestamps = getTimestampsForQueryResultSet(queryResultSet);
        var lastTimestampKey = timestamps[timestamps.length-1];
        var lastDPSValue = queryResultSet[0].dps[lastTimestampKey];
        this.collectdValue=parseInt(lastDPSValue);
        console.log("The collected value " +lastDPSValue);
   });

    this.Then(/^the "([^"]*)" value from maprcli matches the value from OpenTSDB$/, function (volumeSize){
        console.log(`Checking for logical ${volumeSize}`);
        $.expect(this.collectdValue).to.equal(this[volumeSize]);
    });

    this.Then(/^those values may be incorrect but we are only testing for presence$/, function () {});

}