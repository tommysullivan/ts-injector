import {ICucumberStepHelper} from "../clusters/i-cucumber-step-helper";
import {ICustomWorld} from "../cucumber/i-custom-world";

declare const $:ICucumberStepHelper;

module.exports = function() {

    this.Then(/^I can access the shared data from a step in file 2$/, function(this:ICustomWorld) {
        $.expect(this.sharedData).to.exist;
    });

};