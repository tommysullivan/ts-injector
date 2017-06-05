import {IHash} from "../../collections/i-hash";
import {IJSONHash} from "../../typed-json/i-json-value";
import {IRestRequestHeaders} from "../common/i-rest-request-headers";

export interface INativeRequestOptions {
    body?:string;
    form?:IHash<string>;
    headers?:IRestRequestHeaders;
    qs?:IJSONHash;
}