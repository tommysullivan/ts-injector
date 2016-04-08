import IError from "../errors/i-error";
import ISSHResult from "./i-ssh-result";

interface ISSHError extends IError {
    sshResult:ISSHResult;
}

export default ISSHError;