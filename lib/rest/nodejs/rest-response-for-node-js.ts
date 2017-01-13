import {IJSONObject} from "../../typed-json/i-json-object";
import {ITypedJSON} from "../../typed-json/i-typed-json";
import {IRestResponse} from "../common/i-rest-response";
import {IJSONArray, IJSONHash, IJSONValue} from "../../typed-json/i-json-value";
import {INativeServerResponse} from "./i-native-server-response";
import {IJSONParser} from "../../typed-json/i-json-parser";

export class RestResponseForNodeJS implements IRestResponse {
    constructor(
        private error:Error,
        private nativeResponse:INativeServerResponse,
        private _originalUrl:string,
        private typedJSON:ITypedJSON,
        private jsonParser:IJSONParser
    ) {}

    toString():string {
        return JSON.stringify(this.toJSON(), null, 3);
    }

    toJSON():IJSONValue {
        const body =  this.isJSON() ? this.jsonBody : this.body;
        return {
            originalURL: this._originalUrl,
            type: 'rest-response',
            error: this.error.toString(),
            statusCode: this.statusCode,
            body: body
        }
    }

    get isError():boolean {
        return this.error != null || this.nativeResponse.statusCode >= 400;
    }

    get body():string {
        return this.nativeResponse.body;
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

    get jsonBody():IJSONValue {
        return this.jsonParser.parse(this.body);
    }

    get bodyAsJsonObject():IJSONObject {
        return this.typedJSON.newJSONObject(this.jsonHash);
    }

    get statusCode():number {
        return this.nativeResponse.statusCode;
    }

    get jsonHash():IJSONHash {
        if(!this.typedJSON.isJSON(this.jsonBody)) throw new Error(`Was not hash: ${this.jsonBody}`);
        return <IJSONHash> this.jsonBody;
    }

    get jsonArray():IJSONArray {
        if(!this.typedJSON.isArray(this.jsonBody)) throw new Error(`Was not array: ${this.jsonBody}`);
        return <IJSONArray> this.jsonBody;
    }

}