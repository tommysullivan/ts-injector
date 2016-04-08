import IProcessResult from "./i-process-result";
import IList from "../collections/i-list";
import List from "../collections/list";

export default class ProcessResult implements IProcessResult {
    private _command:string;
    private _processExitCode:number;
    private _stdoutLines:IList<string>;
    private _stderrLines:IList<string>;
    private _shellInvocationError:string;

    constructor(command:string, processExitCode:number, stdoutLines:IList<string>, stderrLines:IList<string>, shellInvocationError:string) {
        this._command = command;
        this._processExitCode = processExitCode;
        this._stdoutLines = stdoutLines;
        this._stderrLines = stderrLines;
        this._shellInvocationError = shellInvocationError;
    }

    shellInvocationError():string {
        return this._shellInvocationError;
    }

    command():string {
        return this._command;
    }

    hasError():boolean {
        return this.processExitCode() != 0;
    }

    processExitCode():number {
        return this._processExitCode;
    }

    toString():string {
        return JSON.stringify(this.toJSON(), null, 3);
    }

    stdoutLines():IList<string> {
        return this._stdoutLines;
    }

    stderrLines():IList<string> {
        return this._stderrLines;
    }

    toJSON():any {
        return {
            command: this.command(),
            processExitCode: this.processExitCode(),
            stdoutLines: this.stdoutLines().toJSON(),
            stderrLines: this.stderrLines().toJSON(),
            shellInvocationError: this.shellInvocationError()
        }
    }

    toJSONString():string {
        return JSON.stringify(this.toJSON(), null, 3);
    }
}