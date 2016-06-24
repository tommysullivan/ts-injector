import { binding as steps, given, when, then } from "cucumber-tsflow";
import Framework from "../../lib/framework/framework";
import PromisedAssertion = Chai.PromisedAssertion;
declare var $:Framework;
declare var module:any;

@steps()
export default class TimingSteps {
    @when(/^I wait "([^"]*)" seconds$/)
    waitABit(numSeconds:number):PromisedAssertion {
        var promise = $.promiseFactory.newPromise((resolve, reject) => {
            setTimeout(() => resolve(), numSeconds * 1000);
        });
        return $.expect(promise).to.eventually.be.fulfilled;
    }
}
module.exports = TimingSteps;