import {IProcessResult} from "./i-process-result";
import {IList} from "../collections/i-list";
import {ICollections} from "../collections/i-collections";

export class ProcessResult implements IProcessResult {

    constructor(
        private baseProcessResult:IProcessResult,
        private stdOutIndices:Array<number>,
        private stdErrIndices:Array<number>,
        private allOutput:Array<string>,
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
        return this.collections.newList(this.stdOutIndices)
            .map(index=>this.allOutput[index]);
    }

    get stderrLines():IList<string> {
        return this.collections.newList(this.stdErrIndices)
            .map(index=>this.allOutput[index]);
    }

    get allOutputLines():IList<string> {
        return this.collections.newList(this.allOutput);
    }

    toJSON():any {
        return {
            contentType: 'vnd/mapr.devops.process-result;v=2.0.0',
            command: this.command,
            processExitCode: this.processExitCode,
            stdoutIndices: this.stdOutIndices,
            stderrIndices: this.stdErrIndices,
            allOutput: this.allOutput,
            shellInvocationError: this.shellInvocationError
        }
    }

    toString():string {
        return JSON.stringify(this.toJSON(), null, 3);
    }

}