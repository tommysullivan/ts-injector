import {IRestResponse} from "../common/i-rest-response";
import {IJSONObject} from "../../typed-json/i-json-object";
import {IJSONArray, IJSONHash, IJSONValue} from "../../typed-json/i-json-value";
import {IJSONParser} from "../../typed-json/i-json-parser";
import {NotImplementedError} from "../../errors/not-implemented-error";
import {IList} from "../../collections/i-list";
import {ITypedJSON} from "../../typed-json/i-typed-json";
import {IDictionary} from "../../collections/i-dictionary";
import {IJQueryXHR} from "./i-jquery-xhr";
import {ICollections} from "../../collections/i-collections";

export class RestResponseForBrowser implements IRestResponse {
    constructor(
        private nativeJQueryResponseBody:string,
        private _originalURL:string,
        private jsonParser:IJSONParser,
        private typedJSON:ITypedJSON,
        private xhr:IJQueryXHR,
        private collections:ICollections
    ) {}

    get isError():boolean {
        return this.statusCode >= 400;
    }

    get originalUrl():string {
        return this._originalURL;
    }

    get body():string {
        return typeof(this.nativeJQueryResponseBody) == 'string'
            ? this.nativeJQueryResponseBody
            : JSON.stringify(this.nativeJQueryResponseBody);
    }

    get jsonBody():IJSONValue {
        return this.jsonParser.parse(this.body);
    }

    get jsonHash():IJSONHash {
        return this.jsonParser.parse(this.body) as IJSONHash;
    }

    get jsonArray():IJSONArray {
        return this.jsonParser.parse(this.body) as IJSONArray;
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
        const headerHash = this.xhr.getAllResponseHeaders().split("\n").filter(line => line.trim() != "").map(line => {
            const [name, ...values] = line.split(':');
            return { [name.trim()]: values.join(':').trim() }
        }).reduce((previous, current) => {
            return {
                ...previous,
                ...current
            }
        }, {});
        return this.collections.newDictionary(headerHash);
    }

    toJSON(): IJSONValue {
        return {
            originalUrl: this.originalUrl,
            body: this.jsonBody
        };
    }
}