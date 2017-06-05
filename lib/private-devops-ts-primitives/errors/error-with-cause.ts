import {IError} from "./i-error";

export class ErrorWithCause extends Error implements IError {
    private cause:any;
    private __message:string;

    constructor(message:string, cause:Error) {
        super(`${message} - caused by ${ErrorWithCause.causeMessage(cause)}`);
        this.__message = message;
        this.cause = cause;
    }

    static causeMessage(cause:any):string {
        return cause.stack
            ? cause.stack.split("\n")
            : cause.toJSON
                ? cause.toJSON()
                : cause.toString();
    }
}