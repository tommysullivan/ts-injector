import {IProcessResult} from "./i-process-result";
import {IList} from "../collections/i-list";
import {IJSONValue} from "../typed-json/i-json-value";
import {NotImplementedError} from "../errors/not-implemented-error";

export class BaseProcessResult implements IProcessResult {
    constructor(
        private _command:string,
        private _processExitCode:number,
        private _shellInvocationError:string
    ) {}

    get shellInvocationError():string {
        return this._shellInvocationError;
    }

    get command():string {
        return this._command;
    }

    get hasError():boolean {
        return this.processExitCode != 0;
    }

    get processExitCode():number {
        return this._processExitCode;
    }

    toString():string {
        return JSON.stringify(this.toJSON(), null, 3);
    }

    get stdoutLines():IList<string> {
        throw new NotImplementedError();
    }

    get stderrLines():IList<string> {
        throw new NotImplementedError();
    }

    get allOutputLines():IList<string> {
        throw new NotImplementedError();
    }

    toJSON():IJSONValue {
        throw new NotImplementedError();
    }

    get stdoutAsJSON():IJSONValue {
        throw new NotImplementedError();
    }
}