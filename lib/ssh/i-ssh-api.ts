import ISSHResult from "./i-ssh-result";
import IProcessResult from "../node-js-wrappers/i-process-result";
import ISSHClient from "./i-ssh-client";
import SSHMultiCommandError from "./ssh-multi-command-error";
import IList from "../collections/i-list";

interface ISSHAPI {
    newSSHClient():ISSHClient;
    newSSHError(message:string, shResult:ISSHResult);
    newSSHResult(host:string, processResult:IProcessResult):ISSHResult;
    newSSHMultiCommandError(sshResults:IList<ISSHResult>):SSHMultiCommandError;
}

export default ISSHAPI;