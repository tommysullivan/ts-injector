import {IHash} from "../collections/i-hash";
export type IJSONValue = string | number | boolean | IJSONHash | IJSONArray | IHash<any>;

export interface IJSONHash {
    [key: string]: IJSONValue;
}

export interface IJSONArray extends Array<IJSONValue> { }