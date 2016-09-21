import {IError} from "./i-error";

export class ErrorWithJSONDetails implements IError {
    public message:string;
    public detailJSON:any;

    constructor(message:string, detailJSON:any) {
        this.message = message;
        this.detailJSON = detailJSON;
    }

    toJSON():any {
        return {
            message: this.message,
            detailJSON: this.detailJSON
        };
    }

    toString():string {
        return JSON.stringify(this.toJSON());
    }
}