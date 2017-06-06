import {ISSHResult} from "./i-ssh-result";
import {IJSONValue} from "../typed-json/i-json-value";
import {IProcessResult} from "../process/i-process-result";

export class SSHResult implements ISSHResult {
    constructor(
        public readonly host:string,
        public readonly processResult:IProcessResult
    ) {}

    toJSON():any {
        return {
            host: this.host,
            processResult: this.processResult.toJSON()
        };
    }

    toString():string {
        return JSON.stringify(this.toJSON(), null, 3);
    }

    get stdoutAsJSON():IJSONValue {
        return this.processResult.stdoutAsJSON;
    }
}