import {IList} from "../collections/i-list";
import {IJSONObject} from "../typed-json/i-json-object";
import {IMarathonGroupResult} from "./i-marathon-group-result";

export interface IMarathonResult {
    apps:IList<IJSONObject>;
    message:string;
    hasMessage:boolean;
    tasks:IList<IJSONObject>;
    ipAddressOfLaunchedImage:string;
    id:string;
    groups:IList<IMarathonGroupResult>;
    taskState:string;
    labels:IJSONObject;
}