import {ICucumberStepHelper} from "../clusters/i-cucumber-step-helper";
import {ErrorWithCause} from "../errors/error-with-cause";

declare const $:ICucumberStepHelper;
declare const module:any;

module.exports = function() {

    this.When(/^I construct an ErrorWithCause and a causal Exception then I can print the correct message and toString$/, () => {
        const error = new ErrorWithCause('tommy', new ErrorWithCause('aashreya', new Error('kevin')));
        $.expect(error.message).to.include('tommy');
        $.expect(error.message).to.include('aashreya');
        $.expect(error.message).to.include('kevin');
    });
};