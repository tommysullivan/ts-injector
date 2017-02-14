import {IList} from "../collections/i-list";
import {IJSONObject} from "../typed-json/i-json-object";

export interface IMarathonGroupResult {
    apps:IList<IJSONObject>;
    allApplicationIds:IList<string>;
}