import IError from "./i-error";

export default class ErrorWithCause implements IError {
    private cause:any;
    private _message:string;

    constructor(message:string, cause:Error) {
        this._message = message;
        this.cause = cause;
    }

    get message():string {
        return this._message;
    }

    toString():string {
        return JSON.stringify(this.toJSON(), null, 3);
    }

    toJSON():any {
        return {
            message: this.message,
            cause: this.cause.stack
                ? this.cause.stack.split("\n")
                : this.cause.toJSON
                    ? this.cause.toJSON()
                    : this.cause.toString()
        }
    }
}