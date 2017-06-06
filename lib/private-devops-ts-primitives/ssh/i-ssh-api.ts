import {ISSHResult} from "./i-ssh-result";
import {ISSHClient} from "./i-ssh-client";
import {SSHMultiCommandError} from "./ssh-multi-command-error";
import {IList} from "../collections/i-list";
import {ShellEscaper} from "./shell-escaper";
import {IProcessResult} from "../process/i-process-result";

export interface ISSHAPI {
    newSSHClient():ISSHClient;
    newSSHError(message:string, shResult:ISSHResult);
    newSSHResult(host:string, processResult:IProcessResult):ISSHResult;
    newSSHMultiCommandError(sshResults:IList<ISSHResult>):SSHMultiCommandError;
    newShellEscaper():ShellEscaper;
}