import IESXIClient from "./i-esxi-client";
import IESXIResponse from "./i-esxi-response";
import INodeConfiguration from "../nodes/i-node-configuration";
import IThenable from "../promise/i-thenable";

interface IESXIAction {
    (e:IESXIClient, n:INodeConfiguration):IThenable<IESXIResponse>
}

export default IESXIAction;