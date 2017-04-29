import {IHash} from "../../collections/i-hash";

export interface IJQueryXHR {
    getAllResponseHeaders():string;
    getResponseHeader(headerName:string):string
}