import IList from "../collections/i-list";

interface IProcessResult {
    hasError():boolean;
    toString():string;
    command():string;
    stdoutLines():IList<string>;
    stderrLines():IList<string>;
    processExitCode():number;
    shellInvocationError():string;
    toJSON():any;
    toJSONString():string;
}

export default IProcessResult;