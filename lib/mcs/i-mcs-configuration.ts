import {IJSONSerializable} from "../typed-json/i-json-serializable";

export interface IMCSConfiguration extends IJSONSerializable {
    mcsLoginPath:string;
    mcsDashboardInfoPath:string;
    mcsApplicationLinkPathTemplate:string;
    username:string;
    password:string;
    mcsUrlTemplate:string;
}