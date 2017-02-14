import {IMarathonRestClient} from "./i-marathon-rest-client";
import {IMarathonResult} from "./i-marathon-result";

export interface IMarathon {
    newMarathonRestClient(host:string, port:string):IMarathonRestClient;
    newMarathonResult(resultBody:any):IMarathonResult;
}