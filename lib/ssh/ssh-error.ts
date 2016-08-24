import ISSHResult from "./i-ssh-result";
import ISSHError from "./i-ssh-error";

export default class SSHError implements ISSHError {
    private _sshResult:ISSHResult;
    private _message:string;
    private _stack:any;

    constructor(message:string, sshResult:ISSHResult) {
        const e:any = new Error();
        this._stack = e.stack;
        this._sshResult = sshResult;
        this._message = message;
    }

    get message():string { return this._message; }
    get sshResult():ISSHResult { return this._sshResult; }

    toJSON():any {
        return {
            message: this.message,
            sshResult: (this.sshResult ? this.sshResult.toJSON() : null),
            stack: this._stack.split("\n")
        }
    }

    toJSONString():string {
        return JSON.stringify(this.toJSON(), null, 3);
    }

    toString():string {
        return this.toJSONString();
    }

}