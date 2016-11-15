import {IJSONSerializable} from "./i-json-serializable";
import {IJSONSerializer} from "./i-json-serializer";

export class JSONSerializer implements IJSONSerializer {
    serialize(maybeJSON:IJSONSerializable):any {
        try {
            return maybeJSON==null
                ? null
                : JSON.parse(JSON.stringify(
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