import {IList} from "./i-list";
import {IJSONSerializable} from "../typed-json/i-json-serializable";

export interface IDictionary<ValueType> extends IJSONSerializable {
    add(key:string, value:ValueType):IDictionary<ValueType>;
    get(key:string):ValueType;
    getOrThrow(key:string, errorMessageIfNotExist?:string):ValueType;
    clone():IDictionary<ValueType>;
    hasKey(key:string):boolean;
    keys:IList<string>;
}