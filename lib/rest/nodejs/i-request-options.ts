import {IHash} from "../../collections/i-hash";
import {IRequestHeadersForNodeJS} from "./i-request-headers-for-node-js";

export interface INativeRequestOptions {
    body?:string;
    form?:IHash<string>;
    headers?:IRequestHeadersForNodeJS;
}