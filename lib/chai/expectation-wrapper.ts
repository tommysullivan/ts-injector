import {IList} from "../collections/i-list";
import {Assertion} from "./assertion";
import {IFuture} from "../promise/i-future";
import {ICucumberConfiguration} from "../cucumber/i-cucumber-configuration";
import {ChaiStatic} from "./chai-static";
import {IPromiseFactory} from "../promise/i-promise-factory";
import {IExpectationWrapper} from "./i-expectation-wrapper";

export class ExpectationWrapper implements IExpectationWrapper {

    constructor(
        private cucumberConfig:ICucumberConfiguration,
        private chai:ChaiStatic,
        private promiseFactory:IPromiseFactory
    ) {}

    expect(target:any, message?:string):Assertion {
        if(typeof(target['then'])=='function') {
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
        return this.expect(this.promiseFactory.newGroupPromise(target));
    }

    expectEmptyList<T>(list:IList<T>):void {
        if(list.notEmpty)
            throw new Error(`expected empty list, got ${list.toString()}`);
    }
}