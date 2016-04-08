import IError from "../errors/i-error";
import ISSHResult from "./i-ssh-result";
import IList from "../collections/i-list";

export default class SSHMultiCommandError implements IError {
    public sshResults:IList<ISSHResult>;
    public get message():string {
        return this.toString();
    }

    constructor(sshResults:IList<ISSHResult>) {
        this.sshResults = sshResults;
    }

    toJSON():any {
        return {
            message: this.message,
            sshResults: this.sshResults.toJSON()
        }
    }

    toString():string {
        return `SSHMultiCommandError - ${this.toJSONString()}`;
    }

    toJSONString():string {
        return JSON.stringify(this.toJSON(), null, 3);
    }
}