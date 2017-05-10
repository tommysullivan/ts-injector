import {IProcessResult} from "../node-js-wrappers/i-process-result";
import {IJSONSerializable} from "../typed-json/i-json-serializable";
import {IJSONValue} from "../typed-json/i-json-value";

export interface ISSHResult extends IJSONSerializable {
    host:string;
    processResult:IProcessResult;
    stdoutAsJSON:IJSONValue;
}