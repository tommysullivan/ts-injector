import {IMCSRestSession} from "./i-mcs-rest-session";
import {IFuture} from "../futures/i-future";

export interface IMCSRestClient {
    createAutheticatedSession(username:string, password:string):IFuture<IMCSRestSession>;
}