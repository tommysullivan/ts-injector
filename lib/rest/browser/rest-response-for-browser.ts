import {IRestResponse} from "../common/i-rest-response";
import {IJSONObject} from "../../typed-json/i-json-object";
import {IJSONArray, IJSONHash, IJSONValue} from "../../typed-json/i-json-value";
import {IJSONParser} from "../../typed-json/i-json-parser";
import {NotImplementedError} from "../../errors/not-implemented-error";
import {IList} from "../../collections/i-list";
import {ITypedJSON} from "../../typed-json/i-typed-json";
import {IDictionary} from "../../collections/i-dictionary";

export class RestResponseForBrowser implements IRestResponse {
    constructor(
        private nativeJQueryResponseBody:string,
        private _originalURL:string,
        private jsonParser:IJSONParser,
        private typedJSON:ITypedJSON
    ) {}

    get isError():boolean {
        return this.statusCode >= 400;
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
        return this.typedJSON.newJSONObject(this.jsonHash);
    }

    get bodyAsListOfJsonObjects():IList<IJSONObject> {
        return this.typedJSON.newListOfJSONObjects(this.jsonArray);
    }

    get statusCode():number {
        throw new NotImplementedError();
    }

    get headers():IDictionary<string> {
        throw new NotImplementedError();
    }

    toJSON(): IJSONValue {
        return {
            originalUrl: this.originalUrl,
            body: this.jsonBody
        };
    }
}