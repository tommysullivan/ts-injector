import {ISSHResult} from "./i-ssh-result";
import {IProcessResult} from "../node-js-wrappers/i-process-result";
import {IJSONValue} from "../typed-json/i-json-value";

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