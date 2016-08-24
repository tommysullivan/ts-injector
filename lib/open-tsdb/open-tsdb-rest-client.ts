import Rest from "../rest/rest";
import IDictionary from "../collections/i-dictionary";
import IThenable from "../promise/i-thenable";
import OpenTSDBResult from "./open-tsdb-result";
import OpenTSDB from "./open-tsdb";
import IList from "../collections/i-list";
import ICollections from "../collections/i-collections";

export default class OpenTSDBRestClient {
    private rest:Rest;
    private openTSDBQueryPathTemplate:string;
    private openTSDBHostAndPort:string;
    private openTSDB:OpenTSDB;
    private collections:ICollections;

    constructor(rest:Rest, openTSDBQueryPathTemplate:string, openTSDBHostAndPort:string, openTSDB:OpenTSDB, collections:ICollections) {
        this.rest = rest;
        this.openTSDBQueryPathTemplate = openTSDBQueryPathTemplate;
        this.openTSDBHostAndPort = openTSDBHostAndPort;
        this.openTSDB = openTSDB;
        this.collections = collections;
    }

    queryForMetric(startTime:string, metricName:string):IThenable<OpenTSDBResult> {
        return this.queryForMetricWithTags(startTime, metricName, this.collections.newEmptyDictionary<string>());
    }

    queryForMetricWithTags(startTime:string, metricName:string, soughtTags:IDictionary<string>):IThenable<OpenTSDBResult> {
        const restClientAsPromised = this.rest.newRestClientAsPromised(this.openTSDBHostAndPort);
        const openTSDBQueryPath = this.openTSDBQueryPathTemplate.replace('{start}', startTime).replace('{metricName}', metricName);
        const tagQuery = soughtTags.keys.isEmpty
            ? ''
            : this.soughtTagsAsStringQuery(soughtTags);
        const openTSDBQueryWithTags=`${openTSDBQueryPath}${tagQuery}`;
        console.log(openTSDBQueryWithTags);
        return restClientAsPromised.get(openTSDBQueryWithTags)
            .then(response=>this.openTSDB.newOpenTSDBResponse(soughtTags, metricName, response.jsonBody()));
    }

    private soughtTagsAsStringQuery(soughtTags:IDictionary<string>):string {
        const tagQueryParts = soughtTags.keys.map(k=>`${k}=${soughtTags.get(k).trim()}`);
        return `{${tagQueryParts.join(',')}}`;
    }
}