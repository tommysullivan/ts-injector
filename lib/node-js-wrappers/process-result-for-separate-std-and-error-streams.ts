import {IProcessResult} from "./i-process-result";
import {IList} from "../collections/i-list";
import {ICollections} from "../collections/i-collections";

export class ProcessResultForSeparateStdAndErrorStreams implements IProcessResult {
    constructor(
        private baseProcessResult:IProcessResult,
        private _stdoutLines:IList<string>,
        private _stderrLines:IList<string>,
        private collections:ICollections
    ) {}

    get shellInvocationError():string {
        return this.baseProcessResult.shellInvocationError;
    }

    get command():string {
        return this.baseProcessResult.command;
    }

    get hasError():boolean {
        return this.baseProcessResult.hasError;
    }

    get processExitCode():number {
        return this.baseProcessResult.processExitCode;
    }

    get stdoutLines():IList<string> {
        return this._stdoutLines;
    }

    get stderrLines():IList<string> {
        return this._stderrLines;
    }

    get allOutputLines():IList<string> {
        return this.collections.newList([
            'NOTE from DevOps Automation Framework: stdout and stderr will be shown individually and may appear out of order.',
            'stdout:',
            '',
            ...this.stdoutLines.toArray(),
            '',
            this.collections.newListOfSize(80).map(i=>'*').join(''),
            'stderr:',
            ...this.stderrLines.toArray()
        ]);
    }

    toJSON():any {
        return {
            contentType: 'vnd/mapr.devops.process-result-for-separate-std-and-error-streams;v=1.0.0',
            command: this.command,
            processExitCode: this.processExitCode,
            stdoutLines: this.stdoutLines,
            stderrLines: this.stderrLines,
            shellInvocationError: this.shellInvocationError
        }
    }
}