import {IJSONSerializable} from "./i-json-serializable";

export interface IJSONSerializer {
    serialize(maybeJSON:IJSONSerializable):any;
}