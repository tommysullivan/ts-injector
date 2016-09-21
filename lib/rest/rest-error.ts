import {IError} from "../errors/i-error";
import {IRestResponse} from "./i-rest-response";

export class RestError implements IError {
    constructor(
        private restResponse:IRestResponse
    ) {}

    public get message():string {
        return this.toString();
    }

    toJSON():any {
        return {
            restResponse: this.restResponse.toJSON()
        };
    }

    toString():string {
        return `RestError - ${JSON.stringify(this.toJSON(), null, 3)}`;
    }
}