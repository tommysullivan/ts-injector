import IError from "../errors/i-error";
import RestResponse from "./rest-response";

export default class RestError implements IError {
    public restResponse:RestResponse;

    constructor(restResponse:RestResponse) {
        this.restResponse = restResponse;
    }

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