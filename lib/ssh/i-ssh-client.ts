import {ISSHSession} from './i-ssh-session';
import {IFuture} from "../promise/i-future";

export interface ISSHClient {
    connect(host:String, username:String, password:String):IFuture<ISSHSession>
}