import IThenable from "../promise/i-thenable";
import ISSHSession from "./i-ssh-session";
import ISSHClient from "./i-ssh-client";
import IPromiseFactory from "../promise/i-promise-factory";
import ISSHAPI from "./i-ssh-api";

interface ISSHSessionFactory { (host:string, nodemiralSession:any):ISSHSession }

export default class SSHClient implements ISSHClient {
    private promiseFactory:IPromiseFactory;
    private sshSessionFactory:ISSHSessionFactory;
    private nodemiral:any;

    constructor(promiseFactory:IPromiseFactory, sshSessionFactory:ISSHSessionFactory, nodemiral:any) {
        this.promiseFactory = promiseFactory;
        this.sshSessionFactory = sshSessionFactory;
        this.nodemiral = nodemiral;
    }

    connect(host:string, username:string, password:string):IThenable<ISSHSession> {
        return this.promiseFactory.newPromiseForImmediateValue(
            this.sshSessionFactory(
                host,
                this.nodemiral.session(
                    host,
                    {
                        username: username,
                        password: password
                    },
                    {
                        ssh: {
                            "StrictHostKeyChecking": "no"
                        }
                    }
                )
            )
        );
    }
}