import {IJSONValue} from "./i-json-value";

export interface IJSONMerger {
    mergeJSON(json1:IJSONValue, json2:IJSONValue):IJSONValue;
}