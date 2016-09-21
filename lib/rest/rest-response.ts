import {IJSONObject} from "../typed-json/i-json-object";
import {ITypedJSON} from "../typed-json/i-typed-json";
import {IRestResponse} from "./i-rest-response";

export class RestResponse implements IRestResponse {
    constructor(
        private error:any,
        private nativeResponse:any,
        private _originalUrl:string,
        private typedJSON:ITypedJSON
    ) {}

    toString():string {
        return JSON.stringify(this.toJSON(), null, 3);
    }

    toJSON():any {
        const body =  this.isJSON() ? this.jsonBody : this.body;
        return {
            originalURL: this._originalUrl,
            type: 'rest-response',
            error: this.error,
            statusCode: this.statusCode,
            body: body
        }
    }

    get isError():boolean {
        return this.error || this.nativeResponse.statusCode >= 400;
    }

    get body():string {
        return (this.nativeResponse || {}).body;
    }

    isJSON():boolean {
        try {
            this.jsonBody;
            return true;
        }
        catch(e) {
            return false;
        }
    }

    get originalUrl():string {
        return this._originalUrl;
    }

    get jsonBody():any {
        return JSON.parse(this.body);
    }

    get bodyAsJsonObject():IJSONObject {
        return this.typedJSON.newJSONObject(this.jsonBody);
    }

    get statusCode():number {
        return (this.nativeResponse || {}).statusCode;
    }
}