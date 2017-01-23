import {IMarathonRestClient} from "./i-marathon-rest-client";
import {IMarathonResult} from "./i-marathon-result";
import {ISSHSession} from "../ssh/i-ssh-session";
import {IFuture} from "../futures/i-future";

export interface IMarathon {
    newMarathonRestClient(host:string, port:string):IMarathonRestClient;
    newMarathonResult(resultBody:any):IMarathonResult;
    newMarathonSSHClient(host:string, user:string, password:string):IFuture<ISSHSession>;
}