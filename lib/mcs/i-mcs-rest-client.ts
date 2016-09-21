import {IMCSRestSession} from "./i-mcs-rest-session";
import {IFuture} from "../promise/i-future";

export interface IMCSRestClient {
    createAutheticatedSession(username:string, password:string):IFuture<IMCSRestSession>;
}