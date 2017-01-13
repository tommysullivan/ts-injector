import { binding as steps, given, when, then } from "cucumber-tsflow";
import {IFramework} from "../framework/common/i-framework";
import {PromisedAssertion} from "../chai-as-promised/promised-assertion";

declare const $:IFramework;
declare const module:any;

@steps()
export class TimingSteps {
    @when(/^I wait "([^"]*)" seconds$/)
    waitABit(numSeconds:number):PromisedAssertion {
        const promise = $.futures.newFuture((resolve, reject) => {
            setTimeout(() => resolve(null), numSeconds * 1000);
        });
        return $.expect(promise).to.eventually.be.fulfilled;
    }
}
module.exports = TimingSteps;