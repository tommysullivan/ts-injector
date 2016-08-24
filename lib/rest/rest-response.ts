import IJSONObject from "../typed-json/i-json-object";
import ITypedJSON from "../typed-json/i-typed-json";

export default class RestResponse {
    private error:any;
    private nativeResponse:any;
    private _originalUrl:string;
    private typedJSON:ITypedJSON;

    constructor(error:any, nativeResponse:any, originalUrl:string, typedJSON:ITypedJSON) {
        this.error = error;
        this.nativeResponse = nativeResponse;
        this._originalUrl = originalUrl;
        this.typedJSON = typedJSON;
    }

    toString():string {
        return JSON.stringify(this.toJSON(), null, 3);
    }

    toJSON():any {
        const body =  this.isJSON() ? this.jsonBody() : this.body();
        return {
            originalURL: this._originalUrl,
            type: 'rest-response',
            error: this.error,
            statusCode: this.statusCode(),
            body: body
        }
    }

    isError():boolean {
        return this.error || this.nativeResponse.statusCode >= 400;
    }

    body():string {
        return (this.nativeResponse || {}).body;
    }

    isJSON():boolean {
        try {
            this.jsonBody();
            return true;
        }
        catch(e) {
            return false;
        }
    }

    originalUrl():string {
        return this._originalUrl;
    }

    jsonBody():any {
        return JSON.parse(this.body());
    }

    bodyAsJsonObject():IJSONObject {
        return this.typedJSON.newJSONObject(this.jsonBody());
    }

    statusCode():number {
        return (this.nativeResponse || {}).statusCode;
    }
}