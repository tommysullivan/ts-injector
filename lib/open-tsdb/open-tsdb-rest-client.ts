import {IDictionary} from "../collections/i-dictionary";
import {IFuture} from "../futures/i-future";
import {ICollections} from "../collections/i-collections";
import {IOpenTSDBRestClient} from "./i-open-tsdb-rest-client";
import {IRest} from "../rest/common/i-rest";
import {IOpenTSDB} from "./i-open-tsdb";
import {IOpenTSDBResult} from "./i-open-tsdb-result";

export class OpenTSDBRestClient implements IOpenTSDBRestClient {
    constructor(
        private rest:IRest,
        private openTSDBQueryPathTemplate:string,
        private openTSDBHostAndPort:string,
        private openTSDB:IOpenTSDB,
        private collections:ICollections
    ) {}

    queryForMetric(startTime:string, metricName:string):IFuture<IOpenTSDBResult> {
        return this.queryForMetricWithTags(startTime, metricName, this.collections.newEmptyDictionary<string>());
    }

    queryForMetricWithTags(startTime:string, metricName:string, soughtTags:IDictionary<string>):IFuture<IOpenTSDBResult> {
        const restClientAsPromised = this.rest.newRestClient(this.openTSDBHostAndPort);
        const openTSDBQueryPath = this.openTSDBQueryPathTemplate.replace('{start}', startTime).replace('{metricName}', metricName);
        const tagQuery = soughtTags.keys.isEmpty
            ? ''
            : this.soughtTagsAsStringQuery(soughtTags);
        const openTSDBQueryWithTags=`${openTSDBQueryPath}${tagQuery}`;
        console.log(openTSDBQueryWithTags);
        return restClientAsPromised.get(openTSDBQueryWithTags)
            .then(response=>this.openTSDB.newOpenTSDBResponse(soughtTags, metricName, response.jsonArray));
    }

    private soughtTagsAsStringQuery(soughtTags:IDictionary<string>):string {
        const tagQueryParts = soughtTags.keys.map(k=>`${k}=${soughtTags.get(k).trim()}`);
        return `{${tagQueryParts.join(',')}}`;
    }
}