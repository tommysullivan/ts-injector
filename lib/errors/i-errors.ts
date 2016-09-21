import {IError} from "./i-error";

export interface IErrors {
    newErrorWithCause(cause:IError, optionalMessage:string):IError;
    newErrorWithJSONDetails(message:string, jsonDetails:any):IError;
}