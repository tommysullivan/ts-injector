import {ICucumberStepHelper} from "../clusters/i-cucumber-step-helper";
import {ICustomWorld} from "../cucumber/i-custom-world";

declare const $:ICucumberStepHelper;

module.exports = function() {

    this.Given(/^I have defined some shared data and set it in a before hook$/, function () {});

    this.Then(/^I can access the shared data from a step in file 1$/, function (this:ICustomWorld) {
        $.expect(this.sharedData).to.exist;
    });

};