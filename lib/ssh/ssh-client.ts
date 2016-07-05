import IThenable from "../promise/i-thenable";
import ISSHSession from "./i-ssh-session";
import ISSHClient from "./i-ssh-client";
import IPromiseFactory from "../promise/i-promise-factory";

export interface ISSHSessionFactory { (host:string, nodemiralSession:any, username:string, password:string):ISSHSession }

export default class SSHClient implements ISSHClient {

    constructor(
        private promiseFactory:IPromiseFactory,
        private sshSessionFactory:ISSHSessionFactory,
        private nodemiral:any
    ) {}

    connect(host:string, username:string, password:string):IThenable<ISSHSession> {
        var credentials = {
            username: username,
            password: password
        };
        var options = {
            ssh: {
                "StrictHostKeyChecking": "no"
            }
        };
        var rawSession = this.nodemiral.session(host, credentials, options);
        var wrappedSession = this.sshSessionFactory(host, rawSession, username, password);
        return this.promiseFactory.newPromiseForImmediateValue(wrappedSession);
    }
}