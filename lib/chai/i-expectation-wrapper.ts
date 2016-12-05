import {IList} from "../collections/i-list";
import {Assertion} from "./assertion";
import {IFuture} from "../futures/i-future";

export interface IExpectationWrapper {
    expect(target:any, message?:string):Assertion;
    expectAll<T>(target:IList<IFuture<T>>):Assertion;
    expectEmptyList<T>(list:IList<T>):void;
}