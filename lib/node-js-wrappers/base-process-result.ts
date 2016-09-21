import {IProcessResult} from "./i-process-result";
import {IList} from "../collections/i-list";

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
        throw new Error("not implemented in base process result");
    }

    get stderrLines():IList<string> {
        throw new Error("not implemented in base process result");
    }

    get allOutputLines():IList<string> {
        throw new Error("not implemented in base process result");
    }

    toJSON():any {
        throw new Error("not implemented in base process result");
    }
}