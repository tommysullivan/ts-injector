import {IESXIClient} from "./i-esxi-client";
import {IESXIResponse} from "./i-esxi-response";
import {INodeConfiguration} from "../nodes/i-node-configuration";
import {IFuture} from "../futures/i-future";

export interface IESXIAction {
    (e:IESXIClient, n:INodeConfiguration):IFuture<IESXIResponse>
}