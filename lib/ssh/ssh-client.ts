import {IFuture} from "../promise/i-future";
import {ISSHSession} from "./i-ssh-session";
import {ISSHClient} from "./i-ssh-client";
import {IPromiseFactory} from "../promise/i-promise-factory";

export interface ISSHSessionFactory { (host:string, nodemiralSession:any, username:string, password:string):ISSHSession }

export class SSHClient implements ISSHClient {

    constructor(
        private promiseFactory:IPromiseFactory,
        private sshSessionFactory:ISSHSessionFactory,
        private nodemiral:any
    ) {}

    connect(host:string, username:string, password:string):IFuture<ISSHSession> {
        const credentials = {
            username: username,
            password: password
        };
        const options = {
            ssh: {
                "StrictHostKeyChecking": "no"
            }
        };
        const rawSession = this.nodemiral.session(host, credentials, options);
        const wrappedSession = this.sshSessionFactory(host, rawSession, username, password);
        return this.promiseFactory.newPromiseForImmediateValue(wrappedSession);
    }
}