import {IJSONSerializable} from "../typed-json/i-json-serializable";
import {IJSONValue} from "../typed-json/i-json-value";
import {IProcessResult} from "../process/i-process-result";

export interface ISSHResult extends IJSONSerializable {
    host:string;
    processResult:IProcessResult;
    stdoutAsJSON:IJSONValue;
}