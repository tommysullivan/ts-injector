import {IDictionary} from "../collections/i-dictionary";
import {IList} from "../collections/i-list";

export interface IOpenTSDBResult {
    numberOfEntries:number;
    metric:string;
    soughtTags:IDictionary<string>;
    tags:IList<string>;
    timestamps:IList<string>;
    lastValue(lastTimestamp:string):number;
}