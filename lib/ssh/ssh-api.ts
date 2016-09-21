import {ISSHClient} from "./i-ssh-client";
import {IProcessResult} from "../node-js-wrappers/i-process-result";
import {ISSHSession} from "./i-ssh-session";
import {ISSHAPI} from "./i-ssh-api";
import {SSHClient} from "./ssh-client";
import {IPromiseFactory} from "../promise/i-promise-factory";
import {SSHSession} from "./ssh-session";
import {ISSHResult} from "./i-ssh-result";
import {SSHError} from "./ssh-error";
import {SSHResult} from "./ssh-result";
import {INodeWrapperFactory} from "../node-js-wrappers/i-node-wrapper-factory";
import {ICollections} from "../collections/i-collections";
import {SSHMultiCommandError} from "./ssh-multi-command-error";
import {IList} from "../collections/i-list";
import {ShellEscaper} from "./shell-escaper";
import {IUUIDGenerator} from "../uuid/i-uuid-generator";
import {IPath} from "../node-js-wrappers/i-path";
import {IErrors} from "../errors/i-errors";
import {NodemiralPatcher} from "./nodemiral-patcher";
import {ISSHConfiguration} from "./i-ssh-configuration";

declare const require:any;

const scp2Module = require('scp2');
const shellEscapeModule = require('shell-escape');
const nodemiralPatcher = new NodemiralPatcher();

nodemiralPatcher.applyPatch();

export class SSHAPI implements ISSHAPI {

    constructor(
        private nodemiralModule:any,
        private promiseFactory:IPromiseFactory,
        private nodeWrapperFactory:INodeWrapperFactory,
        private collections:ICollections,
        private sshConfiguration:ISSHConfiguration,
        private uuidGenerator:IUUIDGenerator,
        private path:IPath,
        private errors:IErrors
    ) {}

    private newSSHSession(host:string, nodemiralSession:any, username:string, password:string):ISSHSession {
        return new SSHSession(
            nodemiralSession,
            this.promiseFactory,
            this.nodeWrapperFactory,
            this.collections,
            this,
            host,
            this.sshConfiguration.writeCommandsToStdout,
            this.nodeWrapperFactory.fileSystem(),
            scp2Module,
            username,
            password,
            this.sshConfiguration.temporaryStorageLocation,
            this.uuidGenerator,
            this.path,
            this.errors
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

    newShellEscaper():ShellEscaper {
        return new ShellEscaper(shellEscapeModule);
    }
}