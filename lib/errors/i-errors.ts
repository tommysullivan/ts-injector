import IError from "./i-error";

interface IErrors {
    newErrorWithCause(cause:IError, optionalMessage:string):IError;
    newErrorWithJSONDetails(message:string, jsonDetails:any):IError;
}

export default IErrors;