import {IError} from "./i-error";

export class ErrorWithCause extends Error implements IError {
    private cause:any;
    private __message:string;

    constructor(message:string, cause:Error) {
        super(message);
        this.__message = message;
        this.cause = cause;
    }

    get message():string {
        return `${super.message} - caused by ${this.causeMessage}`;
    }

    get causeMessage():string {
        return this.cause.stack
            ? this.cause.stack.split("\n")
            : this.cause.toJSON
                ? this.cause.toJSON()
                : this.cause.toString();
    }

    toString():string {
        return JSON.stringify(this.toJSON(), null, 3);
    }

    toJSON():any {
        return {
            message: this.__message,
            cause: this.causeMessage
        }
    }
}