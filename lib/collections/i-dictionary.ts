import IList from "./i-list";

interface IDictionary<ValueType> {
    add(key:string, value:ValueType):IDictionary<ValueType>;
    get(key:string):ValueType;
    getOrThrow(key:string, errorMessageIfNotExist?:string):ValueType;
    toJSON():any;
    toJSONString():string;
    clone():IDictionary<ValueType>;
    hasKey(key:string):boolean;
    keys:IList<string>;
}

export default IDictionary;