import {IJSONValue} from "./i-json-value";
import {IHash} from "../collections/i-hash";

export interface IJSONSerializable {
    //NOTE: if toJSON is not defined on an instance of IJSONSerializable,
    //dependents assume JSON.stringify(instance:IJSONSerializable) will succeed
    toJSON?<T>():IJSONValue | IHash<T>;
}