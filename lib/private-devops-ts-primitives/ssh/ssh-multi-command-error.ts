import {IError} from "../errors/i-error";
import {ISSHResult} from "./i-ssh-result";
import {IList} from "../collections/i-list";

export class SSHMultiCommandError implements IError {
    public sshResults:IList<ISSHResult>;

    public get message():string {
        return this.toString();
    }

    constructor(sshResults:IList<ISSHResult>) {
        this.sshResults = sshResults;
    }

    toJSON():any {
        return this.sshResults.toJSON();
    }

    toString():string {
        return `SSHMultiCommandError - ${this.toJSONString()}`;
    }

    toJSONString():string {
        return JSON.stringify(this.toJSON(), null, 3);
    }
}