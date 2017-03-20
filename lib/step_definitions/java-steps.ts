import {PromisedAssertion} from "../chai-as-promised/promised-assertion";
import {ICucumberStepHelper} from "../clusters/i-cucumber-step-helper";

declare const $:ICucumberStepHelper;
declare const module:any;

module.exports = function() {
    this.Given(/^I have installed Java$/, ():PromisedAssertion => {
        return $.expectAll(
            $.clusterUnderTest.nodes.map(n=>n.executeShellCommand(n.packageManager.installJavaCommand))
        ).to.eventually.be.fulfilled;
    });
};