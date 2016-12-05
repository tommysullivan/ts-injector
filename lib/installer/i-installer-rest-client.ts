import {IInstallerRestSession} from "./i-installer-rest-session";
import {IFuture} from "../futures/i-future";

export interface IInstallerRestClient {
    createAutheticatedSession(installerProtocolHostAndOptionalPort:string, username:string, password:string):IFuture<IInstallerRestSession>
}