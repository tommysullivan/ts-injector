import OpenTSDBRestClient from "./open-tsdb-rest-client";
import Rest from "../rest/rest";
import OpenTSDBConfig from "./open-tsdb-config";
import OpenTSDBResult from "./open-tsdb-result";
import ICollections from "../collections/i-collections";
import ITypedJSON from "../typed-json/i-typed-json";
import IList from "../collections/i-list";
import IDictionary from "../collections/i-dictionary";

export default class OpenTSDB {
    private rest:Rest;
    private openTSDBConfig:OpenTSDBConfig;
    private collections:ICollections;
    private typedJSON:ITypedJSON;

    constructor(rest:Rest, openTSDBConfig:OpenTSDBConfig, collections:ICollections, typedJSON:ITypedJSON) {
        this.rest = rest;
        this.openTSDBConfig = openTSDBConfig;
        this.collections = collections;
        this.typedJSON = typedJSON;
    }

    newOpenTSDBRestClient(host:string):OpenTSDBRestClient {
        var openTSDBHostAndPort = this.openTSDBConfig.openTSDBUrlTemplate.replace('{host}', host);
        return new OpenTSDBRestClient(
            this.rest,
            this.openTSDBConfig.openTSDBQueryPathTemplate,
            openTSDBHostAndPort,
            this,
            this.collections
        );
    }

    newOpenTSDBResponse(soughtTags:IDictionary<string>, metricName:string, jsonArray:any):OpenTSDBResult {
        return new OpenTSDBResult(soughtTags, metricName, jsonArray, this.collections, this.typedJSON);
    }
}