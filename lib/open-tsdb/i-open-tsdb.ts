import {IOpenTSDBRestClient} from "./i-open-tsdb-rest-client";
import {IOpenTSDBResult} from "./i-open-tsdb-result";
import {IDictionary} from "../collections/i-dictionary";

export interface IOpenTSDB {
    newOpenTSDBRestClient(host:string):IOpenTSDBRestClient;
    newOpenTSDBResponse(soughtTags:IDictionary<string>, metricName:string, jsonArray:Array<any>):IOpenTSDBResult;
}