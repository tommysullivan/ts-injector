import {IRequestHeadersForNodeJS} from "./i-request-headers-for-node-js";

export interface IDefaultOptions {
    jar:boolean,
    agentOptions?: {
        rejectUnauthorized:boolean
    },
    headers?: IRequestHeadersForNodeJS
}