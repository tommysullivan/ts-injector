import {ICucumberStepHelper} from "../clusters/i-cucumber-step-helper";
import {PromisedAssertion} from "../chai-as-promised/promised-assertion";
declare const $:ICucumberStepHelper;
declare const module:any;

module.exports = function() {

    this.Given(/^I set the mfs instance to "([^"]*)"$/, (mfsInstances:string):PromisedAssertion => {
        const futureSSHResult = $.clusterUnderTest.nodes.first.executeShellCommand(`maprcli config save -values '{"multimfs.numinstances.pernode":"${mfsInstances}}'`);
        return $.expect(futureSSHResult).to.eventually.be.fulfilled;
    });
};