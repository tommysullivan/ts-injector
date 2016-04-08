import OpenTSDBRestClient from "./open-tsdb-rest-client";
import Rest from "../rest/rest";
import OpenTSDBConfig from "./open-tsdb-config";

export default class OpenTSDB {
    private rest:Rest;
    private openTSDBConfig:OpenTSDBConfig;

    constructor(rest:Rest, openTSDBConfig:OpenTSDBConfig) {
        this.rest = rest;
        this.openTSDBConfig = openTSDBConfig;
    }

    newOpenTSDBRestClient(host:string):OpenTSDBRestClient {
        var openTSDBHostAndPort = this.openTSDBConfig.openTSDBUrlTemplate.replace('{host}', host);
        return new OpenTSDBRestClient(this.rest, this.openTSDBConfig.openTSDBQueryPathTemplate, openTSDBHostAndPort);
    }
}