import {IList} from "../collections/i-list";
import {IDictionary} from "./../collections/i-dictionary";
import {IFuture} from "../futures/i-future";
import {IProcessResult} from "./i-process-result";
import {IFutureWithProgress} from "../futures/i-future-with-progress";
import {IProcessOutputProgress} from "../ssh/i-ssh-session";

export interface IChildProcess extends IFutureWithProgress<IProcessOutputProgress, IProcessResult> {
    kill():IFuture<{processExitCode:number, signal:string}>;
}

export interface IProcess {
    environmentVariables:IDictionary<string>;
    environmentVariableNamed(name:string):string;
    environmentVariableNamedOrDefault(name:string, defaultValueIfNotDefined:string):string;
    environmentVariableNamedOrLazyDefault(name:string, defaultValueFuncIfNotDefined:()=>string):string;
    commandLineArguments:IList<string>;
    exit(exitCode:Number):void;
    getArgvOrThrow(argName:string, index:number):string;
    currentUserName:string;
    pathToNodeJSExecutable:string;
    executeCommand(command: string, environmentVariables: IDictionary<string>):IChildProcess;
    executeNodeProcess(command:string, environmentVariables:IDictionary<string>):IChildProcess;
    processName:string;
}