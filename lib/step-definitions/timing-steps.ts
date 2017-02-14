import { binding as steps, given, when, then } from "cucumber-tsflow";
import {ICucumberStepHelper} from "../clusters/i-cucumber-step-helper";
import {PromisedAssertion} from "../chai-as-promised/promised-assertion";

declare const $:ICucumberStepHelper;
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