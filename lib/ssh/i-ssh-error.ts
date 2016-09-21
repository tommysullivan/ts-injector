import {IError} from "../errors/i-error";
import {ISSHResult} from "./i-ssh-result";

export interface ISSHError extends IError {
    sshResult:ISSHResult;
}