import ISSHResult from "./i-ssh-result";
import IProcessResult from "../node-js-wrappers/i-process-result";
export default class SSHResult implements ISSHResult {
    private _host:string;
    private _processResult:IProcessResult;

    constructor(host:string, processResult:IProcessResult) {
        this._host = host;
        this._processResult = processResult;
    }

    host():string {
        return this._host;
    }

    processResult():IProcessResult {
        return this._processResult;
    }

    toJSON():any {
        return {
            host: this.host(),
            processResult: this.processResult().toJSON()
        };
    }

    toString():string {
        return this.toJSONString();
    }

    toJSONString():string {
        return JSON.stringify(this.toJSON(), null, 3);
    }
}