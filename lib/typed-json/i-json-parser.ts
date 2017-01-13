import {IJSONValue} from "./i-json-value";

export interface IJSONParser {
    parse(json:string):IJSONValue;
}