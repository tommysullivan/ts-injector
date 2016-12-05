import {IList} from "../collections/i-list";
import {IDictionary} from "./../collections/i-dictionary";
import {IFuture} from "../futures/i-future";
import {IProcessResult} from "./i-process-result";

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
    executeNodeProcess(command:string, environmentVariables:IDictionary<string>):IFuture<IProcessResult>;
    processName:string;
}