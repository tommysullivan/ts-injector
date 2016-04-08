import Rest from "../rest/rest";

export default class OpenTSDBRestClient {
    private rest:Rest;
    private openTSDBQueryPathTemplate:string;
    private openTSDBHostAndPort:string;

    constructor(rest:Rest, openTSDBQueryPathTemplate:string, openTSDBHostAndPort:string) {
        this.rest = rest;
        this.openTSDBQueryPathTemplate = openTSDBQueryPathTemplate;
        this.openTSDBHostAndPort = openTSDBHostAndPort;
    }

    queryForMetric(startTime:string, metricName:string):any {
        var restClientAsPromised = this.rest.newRestClientAsPromised(this.openTSDBHostAndPort);
        var openTSDBQueryPath = this.openTSDBQueryPathTemplate.replace('{start}', startTime);
        openTSDBQueryPath = openTSDBQueryPath.replace('{metricName}', metricName);
        return restClientAsPromised.get(openTSDBQueryPath)
            .then(response=>response.jsonBody());
    }
}