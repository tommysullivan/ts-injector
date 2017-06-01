import {IError} from "./i-error";
import {IJSONValue} from "../typed-json/i-json-value";

export class ErrorWithJSONDetails implements IError {
    public message:string;
    public detailJSON:IJSONValue;

    constructor(message:string, detailJSON:IJSONValue) {
        this.message = message;
        this.detailJSON = detailJSON;
    }

    toJSON():IJSONValue {
        return {
            message: this.message,
            detailJSON: this.detailJSON
        };
    }

    toString():string {
        return JSON.stringify(this.toJSON());
    }
}