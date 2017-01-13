import {IError} from "./i-error";
import {IJSONValue} from "../typed-json/i-json-value";

export interface IErrors {
    newErrorWithCause(cause:IError, optionalMessage:string):IError;
    newErrorWithJSONDetails(message:string, jsonDetails:IJSONValue):IError;
}