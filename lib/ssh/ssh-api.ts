import ISSHClient from "./i-ssh-client";
import IProcessResult from "../node-js-wrappers/i-process-result";
import ISSHSession from "./i-ssh-session";
import ISSHAPI from "./i-ssh-api";
import SSHClient from "./ssh-client";
import IPromiseFactory from "../promise/i-promise-factory";
import SSHSession from "./ssh-session";
import ISSHResult from "./i-ssh-result";
import SSHError from "./ssh-error";
import SSHResult from "./ssh-result";
import INodeWrapperFactory from "../node-js-wrappers/i-node-wrapper-factory";
import ICollections from "../collections/i-collections";
import SSHConfiguration from "./ssh-configuration";
import SSHMultiCommandError from "./ssh-multi-command-error";
import IList from "../collections/i-list";

declare var require:any;
require('./nodemiral-patch');

export default class SSHAPI implements ISSHAPI {
    private nodemiralModule:any;
    private promiseFactory:IPromiseFactory;
    private nodeWrapperFactory:INodeWrapperFactory;
    private collections:ICollections;
    private sshConfiguration:SSHConfiguration;

    constructor(nodemiralModule:any, promiseFactory:IPromiseFactory, nodeWrapperFactory:INodeWrapperFactory, collections:ICollections, sshConfiguration:SSHConfiguration) {
        this.nodemiralModule = nodemiralModule;
        this.promiseFactory = promiseFactory;
        this.nodeWrapperFactory = nodeWrapperFactory;
        this.collections = collections;
        this.sshConfiguration = sshConfiguration;
    }

    private newSSHSession(host:string, nodemiralSession:any):ISSHSession {
        return new SSHSession(
            nodemiralSession,
            this.promiseFactory,
            this.nodeWrapperFactory,
            this.collections,
            this,
            host,
            this.sshConfiguration.writeCommandsToStdout
        );
    }

    newSSHClient():ISSHClient {
        return new SSHClient(this.promiseFactory, this.newSSHSession.bind(this), this.nodemiralModule);
    }

    newSSHError(message:string, sshResult:ISSHResult) {
        return new SSHError(message, sshResult);
    }

    newSSHResult(host:string, processResult:IProcessResult):ISSHResult {
        return new SSHResult(host, processResult);
    }

    newSSHMultiCommandError(sshResults:IList<ISSHResult>):SSHMultiCommandError {
        return new SSHMultiCommandError(sshResults);
    }
}