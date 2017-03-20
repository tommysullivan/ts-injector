import {ICucumberStepHelper} from "../clusters/i-cucumber-step-helper";
import {PromisedAssertion} from "../chai-as-promised/promised-assertion";

declare const $:ICucumberStepHelper;
declare const module:any;

module.exports = function() {
    this.When(/^I wait "([^"]*)" seconds$/, (numSeconds:number):PromisedAssertion => {
        const promise = $.futures.newFuture((resolve, reject) => {
            setTimeout(() => resolve(null), numSeconds * 1000);
        });
        return $.expect(promise).to.eventually.be.fulfilled;
    });
};