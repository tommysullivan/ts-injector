import {IError} from "./i-error";
import {IJSONValue} from "../typed-json/i-json-value";

export declare class Error {
    public name:string;
    public message:string;
    public stack:string;
    constructor(message?:string);
    static captureStackTrace(error: Error, omittedStackFrame:Function);
}

export class Exception extends Error implements IError {
    constructor(message?: string, public innerException?:Error) {
        super();
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, Exception);
        }
        this.name = "Exception";
        if (innerException instanceof Error) {
            this.message = message + ", innerException: " + this.innerException.message;
        }
        else {
            this.message = message;
        }
    }

    toJSON():IJSONValue {
        return {
            type: 'Exception',
            message: this.message
        }
    }
}