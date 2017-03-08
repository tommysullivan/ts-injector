import {IFuture} from "../futures/i-future";
import {IDictionary} from "../collections/i-dictionary";
import {IOpenTSDBResult} from "./i-open-tsdb-result";
export interface IOpenTSDBRestClient {
    queryForMetric(startTime:string, metricName:string):IFuture<IOpenTSDBResult>;
    queryForMetricWithTags(startTime:string, metricName:string, soughtTags:IDictionary<string>):IFuture<IOpenTSDBResult>;

}