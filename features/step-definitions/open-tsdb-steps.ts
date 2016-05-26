import Framework from "../../lib/framework/framework";
import IList from "../../lib/collections/i-list";
import OpenTSDBResult from "../../lib/open-tsdb/open-tsdb-result";
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
           .then(openTSDBResults=>{
               this.openTSDBResults = openTSDBResults;
           });
       return $.expect(metricGroupRequest).to.eventually.be.fulfilled;
   });

    this.When(/^I query for the following metrics using tags:$/, function (table) {
        this.metricNames = $.cucumber.getArrayFromTable(table);
        var metricGroupRequest = $.clusterUnderTest.newOpenTSDBRestClient()
            .then(c=>{
                return $.promiseFactory.newGroupPromise(
                    this.metricNames.map(metricName=>c.queryForMetricWithTags(this.queryRangeStart, metricName, this.soughtTags))
                );
            })
            .then(openTSDBResults=>this.openTSDBResults = openTSDBResults);
        return $.expect(metricGroupRequest).to.eventually.be.fulfilled;
    });

    this.When(/^I query for each volume using tag key "([^"]*)" and tag value as the name of the volume$/, function (tagKey) {
        this.soughtTags = $.collections.newEmptyDictionary<string>();
        this.soughtTags.add(tagKey, this.volumeName);
    });

    this.Then(/^I receive at least "([^"]*)" values per metric covering that time period$/, function (numExpectedValuesPerMetricString) {
        var numExpectedValuesPerMetric = parseInt(numExpectedValuesPerMetricString);
        var openTSDBResults:IList<OpenTSDBResult> = this.openTSDBResults;
        var badOpenTSDBResults = openTSDBResults.filter(q=>{
            return q.numberOfEntries < numExpectedValuesPerMetric
        });
        if(badOpenTSDBResults.length>0) {
            var details = badOpenTSDBResults.map(b=>b.toString()).join("\n");
            throw new Error(`The following requests yielded insufficient results: ${details}`);
        }
   });

   this.Then(/^the "([^"]*)" value from maprcli matches the value from OpenTSDB$/, function (volumeProperty){
       console.log(`Checking for the volume property ${volumeProperty}`);
       $.expect(this.collectdValue).to.equal(this[volumeProperty]);
   });

   this.Then(/^those values may be incorrect but we are only testing for presence$/, function () {});

   this.When(/^I query the following tag names for "([^"]*)" metric:$/, function (metricName, table) {
       var metricGroupRequest = $.clusterUnderTest.newOpenTSDBRestClient()
           .then(c=> {
               var rowList = $.collections.newList<Array<string>>(table.rows());
               return $.promiseFactory.newGroupPromise(
                   rowList.flatMap(r=>{
                       var tagValues = $.collections.newList<string>(r[1].split(","));
                       var tagName = r[0];
                       return tagValues.map(tagValue=>{
                           var soughtTags = $.collections.newEmptyDictionary<string>();
                           soughtTags.add(tagName, tagValue);
                           return c.queryForMetricWithTags(
                               this.queryRangeStart,
                               metricName,
                               soughtTags
                           );
                       });
                   })
               );
           })
           .then(openTSDBResults=>this.openTSDBResults=openTSDBResults);
       return $.expect(metricGroupRequest).to.eventually.be.fulfilled;
   });
}