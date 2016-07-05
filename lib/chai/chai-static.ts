import {Assertion} from "./assertion";
export interface ChaiStatic {
    expect(...args:Array<any>):Assertion;
}