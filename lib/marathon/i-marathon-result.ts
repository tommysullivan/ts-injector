import {IList} from "../collections/i-list";
import {IJSONObject} from "../typed-json/i-json-object";

export interface IMarathonResult {
    apps:IList<IJSONObject>;
    message:string;
    hasMessage:boolean;
    tasks:IList<IJSONObject>;
    ipAddressOfLaunchedImage:string;
    id:string;
}