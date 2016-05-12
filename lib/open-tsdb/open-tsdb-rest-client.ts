import Rest from "../rest/rest";
import IDictionary from "../collections/i-dictionary";

export default class OpenTSDBRestClient {
    private rest:Rest;
    private openTSDBQueryPathTemplate:string;
    private openTSDBHostAndPort:string;

    constructor(rest:Rest, openTSDBQueryPathTemplate:string, openTSDBHostAndPort:string) {
        this.rest = rest;
        this.openTSDBQueryPathTemplate = openTSDBQueryPathTemplate;
        console.log(openTSDBQueryPathTemplate);
        this.openTSDBHostAndPort = openTSDBHostAndPort;
    }

    queryForMetric(startTime:string, metricName:string):any {
        this.queryForMetricWithTags(startTime, metricName, '');
    }

    queryForMetricWithTags(startTime:string, metricName:string, tagList:string):any {
        var restClientAsPromised = this.rest.newRestClientAsPromised(this.openTSDBHostAndPort);
        var openTSDBQueryPath = this.openTSDBQueryPathTemplate.replace('{start}', startTime);
        openTSDBQueryPath = openTSDBQueryPath.replace('{metricName}', metricName);
        var openTSDBQueryWithTags=openTSDBQueryPath+tagList;
        console.log(openTSDBQueryWithTags);
        return restClientAsPromised.get(openTSDBQueryWithTags)
            .then(response=>response.jsonBody());
    }
}