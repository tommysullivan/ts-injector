import {OpenTSDBRestClient} from "./open-tsdb-rest-client";
import {OpenTSDBResult} from "./open-tsdb-result";
import {ICollections} from "../collections/i-collections";
import {ITypedJSON} from "../typed-json/i-typed-json";
import {IDictionary} from "../collections/i-dictionary";
import {IRest} from "../rest/i-rest";
import {IOpenTSDBRestClient} from "./i-open-tsdb-rest-client";
import {IOpenTSDBResult} from "./i-open-tsdb-result";
import {IOpenTSDB} from "./i-open-tsdb";
import {IOpenTSDBConfiguration} from "./i-open-tsdb-configuration";

export class OpenTSDB implements IOpenTSDB {
    constructor(
        private rest:IRest,
        private openTSDBConfig:IOpenTSDBConfiguration,
        private collections:ICollections,
        private typedJSON:ITypedJSON
    ) {}

    newOpenTSDBRestClient(host:string):IOpenTSDBRestClient {
        const openTSDBHostAndPort = this.openTSDBConfig.openTSDBUrlTemplate.replace('{host}', host);
        return new OpenTSDBRestClient(
            this.rest,
            this.openTSDBConfig.openTSDBQueryPathTemplate,
            openTSDBHostAndPort,
            this,
            this.collections
        );
    }

    newOpenTSDBResponse(soughtTags:IDictionary<string>, metricName:string, jsonArray:Array<any>):IOpenTSDBResult {
        return new OpenTSDBResult(soughtTags, metricName, jsonArray, this.collections, this.typedJSON);
    }
}