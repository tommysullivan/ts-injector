import {IError} from "./i-error";
import {ErrorWithJSONDetails} from "./error-with-json-details";
import {IErrors} from "./i-errors";
import {Exception} from "./exception";

export class Errors implements IErrors {
    newErrorWithCause(cause:any, optionalMessage:string):IError {
        return new Exception(optionalMessage, cause);
    }

    newErrorWithJSONDetails(message:string, jsonDetails:any):IError {
        return new ErrorWithJSONDetails(message, jsonDetails);
    }
}