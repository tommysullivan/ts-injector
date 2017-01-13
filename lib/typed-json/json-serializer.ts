import {IJSONSerializable} from "./i-json-serializable";
import {IJSONSerializer} from "./i-json-serializer";
import {IJSONValue} from "./i-json-value";
import {IJSONParser} from "./i-json-parser";

export class JSONSerializer implements IJSONSerializer {
    constructor(
        private jsonParser:IJSONParser
    ) {}

    serialize(maybeJSON:IJSONSerializable):IJSONValue {
        try {
            return maybeJSON==null
                ? null
                : this.jsonParser.parse(JSON.stringify(
                    maybeJSON.toJSON
                        ? maybeJSON.toJSON()
                        : maybeJSON
                ));
        }
        catch(e) {
            throw new Error(`Cannot serialize to JSON. Object must either be compatible with JSON.stringify or define a toJSON method. Original error: ${e}`);
        }
    }

    serializeToString(maybeJSON:IJSONSerializable):string {
        return JSON.stringify(this.serialize(maybeJSON), null, 3);
    }
}