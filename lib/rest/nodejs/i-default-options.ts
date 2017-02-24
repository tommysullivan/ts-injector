import {IRestRequestHeaders} from "../common/i-rest-request-headers";

export interface IDefaultOptions {
    jar:boolean,
    agentOptions?: {
        rejectUnauthorized:boolean
    },
    headers?: IRestRequestHeaders
}