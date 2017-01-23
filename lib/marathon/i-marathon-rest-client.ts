import {IJSONObject} from "../typed-json/i-json-object";
import {IMarathonResult} from "./i-marathon-result";
import {IList} from "../collections/i-list";
import {IFuture} from "../futures/i-future";

export interface IMarathonRestClient {
    createApplicationAndGetID(appData:IJSONObject):IFuture<string>;
    checkApplicationRunning(appId:string):IFuture<string>;
    killApplication(id:string):IFuture<IMarathonResult>;
    getApplicationIP(appId:string):IFuture<string>;
    createEmptyGroup(groupName:string): IFuture<string>;
    createApplicationWithGroup(groupName:string,applicationBody:IList<IJSONObject>):IFuture<string>;
    clearGroup(groupName:string):IFuture<string>;
    getApplicationIPInGroup(groupName:string, appId:string):IFuture<string>;
    getAllApplicationIPsInGroup(groupName:string):IFuture<IList<string>>;
    getAllApplicationIdsInGroup(groupName:string) :IFuture<IList<string>>;
}