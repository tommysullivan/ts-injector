import { binding as steps, given, when, then } from "cucumber-tsflow";
import Framework from "../../lib/framework/framework";
import PromisedAssertion = Chai.PromisedAssertion;
import IDictionary from "../../lib/collections/i-dictionary";
import IList from "../../lib/collections/i-list";
import OpenTSDBResult from "../../lib/open-tsdb/open-tsdb-result";
declare var $:Framework;
declare var module:any;

@steps()
export default class OpenTSBBSteps {
    private queryRangeStart:string;
    private volumeDictionary:IDictionary<string>;
    private metricNames:IList<string>;
    private openTSDBResults:IList<OpenTSDBResult>;
    private soughtTags:IDictionary<string>;
    private volumeName:string;
    private collectdValue:string;

    @when(/^I specify the query range start as "([^"]*)"$/)
    specifyRangeStart(queryRangeStart:string):void {
        this.queryRangeStart = queryRangeStart;
    }

    @when(/^I query for the following metrics:$/)
    queryForMetrics(table:string):PromisedAssertion {
        this.metricNames = $.cucumber.getListOfStringsFromTable(table);
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
    }

    @when(/^I query for the following metrics using tags:$/)
    queryForMetricsUsingPreviouslySpecifiedTags(table:string):PromisedAssertion {
        this.metricNames = $.cucumber.getListOfStringsFromTable(table);
        var futureOpenTSDBResults = $.clusterUnderTest.newOpenTSDBRestClient()
            .then(otsdb=>$.promiseFactory.newGroupPromise(
                this.metricNames.map(
                    metricName=>otsdb.queryForMetricWithTags(
                        this.queryRangeStart,
                        metricName,
                        this.soughtTags
                    )
                )
            ))
            .then(openTSDBResults => this.openTSDBResults = openTSDBResults);
        return $.expect(futureOpenTSDBResults).to.eventually.be.fulfilled;
    }

    @when(/^I query for each volume using tag key "([^"]*)" and tag value as the name of the volume$/)
    queryForEachVolumeUsingSpecifiedKeyWhereValueIsAlwaysVolumeName(tagKey:string):void {
        this.soughtTags = $.collections.newEmptyDictionary<string>();
        this.soughtTags.add(tagKey, this.volumeName);
    }

    @then(/^I receive at least "([^"]*)" values per metric covering that time period$/)
    verifyMinimumNumberOfValuesForTimePeriod(numExpectedValuesPerMetricString):void {
        var numExpectedValuesPerMetric = parseInt(numExpectedValuesPerMetricString);
        var openTSDBResults:IList<OpenTSDBResult> = this.openTSDBResults;
        var badOpenTSDBResults = openTSDBResults.filter(q=>{
            return q.numberOfEntries < numExpectedValuesPerMetric
        });
        $.expectEmptyList(badOpenTSDBResults);
    }

    @then(/^the "([^"]*)" value from maprcli matches the value from OpenTSDB$/)
    verifyMaprCliMatchesValueFromOpenTSDB(volumeProperty:string):void {
        console.log(`Checking for the volume property ${volumeProperty}`);
        $.expect(this.collectdValue).to.equal(this.volumeDictionary.get(volumeProperty));
    }

    @then(/^those values may be incorrect but we are only testing for presence$/)
    englishNotificationOnly():void {}

    //TODO: any?
    @when(/^I query the following tag names for "([^"]*)" metric:$/)
    queryTagNamesForMetric(metricName:string, tableOfTagNames:any):PromisedAssertion {
        var metricGroupRequest = $.clusterUnderTest.newOpenTSDBRestClient()
            .then(c=> {
                var rowList = $.collections.newList<Array<string>>(tableOfTagNames.rows());
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
    }

    @given(/^I make sure cron job for tsdb is started on nodes hosting opentsdb$/)
    checkForTSDBCronJob () {
        var tsdbVersion = $.clusterUnderTest.nodesHosting('mapr-opentsdb').first().packages.where(p => p.name == 'mapr-opentsdb').first().version;
        var checkString = `/opt/mapr/opentsdb/opentsdb-${tsdbVersion}/bin/tsdb_cluster_mgmt.sh -purgeData`;
        var results = $.clusterUnderTest.nodesHosting('mapr-opentsdb').map(n => {
                return n.executeShellCommand(`crontab -u mapr -l | grep opentsdb`)
                    .then(cmdResult => {
                        $.expect(cmdResult.processResult().stdoutLines().first().indexOf(`${checkString}`) > -1).to.be.true;
                    })
            }
        );
        return $.expectAll(results).to.eventually.be.fulfilled;
    }
}
module.exports = OpenTSBBSteps;