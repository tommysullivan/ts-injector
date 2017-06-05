import {IJSONSerializable} from "./i-json-serializable";
import {IJSONValue} from "./i-json-value";

export interface IJSONSerializer {
    serialize(maybeJSON:IJSONSerializable):IJSONValue;
    serializeToString(maybeJSON:IJSONSerializable):string;
}