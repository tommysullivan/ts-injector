import {IJSONValue} from "../typed-json/i-json-value";
export interface IError {
    message:string;
    toJSON():IJSONValue;
    toString():string;
}