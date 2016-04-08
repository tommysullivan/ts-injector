import IList from "../collections/i-list";
import IDictionary from "./../collections/i-dictionary";
import IThenable from "../promise/i-thenable";
import IProcessResult from "./i-process-result";

interface IProcess {
    environmentVariables():IDictionary<string>;
    environmentVariableNamed(name:string):string;
    commandLineArguments():IList<string>;
    exit(exitCode:Number):void;
    getArgvOrThrow(argName:string, index:number):string;
    currentUserName():string;
    pathToNodeJSExecutable():string;
    executeNodeProcess(command:string, environmentVariables:IDictionary<string>):IThenable<IProcessResult>;
    processName():string;
}

export default IProcess;