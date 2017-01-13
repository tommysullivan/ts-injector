import {IRestResponse} from "../common/i-rest-response";
import {IJSONObject} from "../../typed-json/i-json-object";
import {IJSONArray, IJSONHash, IJSONValue} from "../../typed-json/i-json-value";
import {IJSONParser} from "../../typed-json/i-json-parser";

export class RestResponseForBrowser implements IRestResponse {
    constructor(
        private nativeJQueryResponseBody:string,
        private _originalURL:string,
        private jsonParser:IJSONParser
    ) {}

    get isError():boolean {
        throw new Error('not impl');
    }

    get originalUrl():string {
        return this._originalURL;
    }

    get body():string {
        return this.nativeJQueryResponseBody;
    }

    get jsonBody():IJSONValue {
        return this.jsonParser.parse(this.body);
    }

    get jsonHash():IJSONHash {
        return <IJSONHash> this.jsonParser.parse(this.body);
    }

    get jsonArray():IJSONArray {
        return <IJSONArray> this.jsonParser.parse(this.body);
    }

    get bodyAsJsonObject():IJSONObject {
        throw new Error('not impl');
    }

    get statusCode():number {
        throw new Error('not impl');
    }

    toJSON(): IJSONValue {
        return {
            originalUrl: this.originalUrl,
            body: this.jsonBody
        };
    }
}