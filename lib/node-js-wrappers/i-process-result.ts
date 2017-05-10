import {IList} from "../collections/i-list";
import {IJSONSerializable} from "../typed-json/i-json-serializable";
import {IJSONValue} from "../typed-json/i-json-value";

export interface IProcessResult extends IJSONSerializable {
    hasError:boolean;
    command:string;
    stdoutLines:IList<string>;
    stderrLines:IList<string>;
    allOutputLines:IList<string>;
    processExitCode:number;
    shellInvocationError:string;
    stdoutAsJSON:IJSONValue;
}