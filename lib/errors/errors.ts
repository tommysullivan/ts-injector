import ErrorWithCause from "./error-with-cause";
import IError from "./i-error";
import ErrorWithJSONDetails from "./error-with-json-details";
import IErrors from "./i-errors";

export default class Errors implements IErrors {
    newErrorWithCause(cause:any, optionalMessage:string):IError {
        return new ErrorWithCause(optionalMessage, cause);
    }

    newErrorWithJSONDetails(message:string, jsonDetails:any):IError {
        return new ErrorWithJSONDetails(message, jsonDetails);
    }
}