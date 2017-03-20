import {IList} from "../collections/i-list";
import {Assertion} from "./assertion";
import {ICucumberConfiguration} from "../cucumber/i-cucumber-configuration";
import {ChaiStatic} from "./chai-static";
import {IExpectationWrapper} from "./i-expectation-wrapper";
import {IFutures} from "../futures/i-futures";
import {IFuture} from "../futures/i-future";

export class ExpectationWrapper implements IExpectationWrapper {

    constructor(
        private cucumberConfig:ICucumberConfiguration,
        private chai:ChaiStatic,
        private futures:IFutures
    ) {}

    expect(target:any, message?:string):Assertion {
        if(target !== undefined && typeof(target['then'])=='function') {
            const targetAsPromise:IFuture<any> = target;
            const targetWithErrorMessageHelper = targetAsPromise
                .catch(error=>{
                    if(this.cucumberConfig.embedAsyncErrorsInStepOutput)
                        console.log(error.toJSON ? error.toJSON() : error.toString());
                    throw error.toString();
                });
            return this.chai.expect(targetWithErrorMessageHelper);
        } else return this.chai.expect(target, message);
    }

    expectAll<T>(target:IList<IFuture<T>>):Assertion {
        return this.expect(this.futures.newFutureList(target));
    }

    expectEmptyList<T>(list:IList<T>):void {
        if(list.notEmpty)
            throw new Error(`expected empty list, got ${list.toString()}`);
    }
}