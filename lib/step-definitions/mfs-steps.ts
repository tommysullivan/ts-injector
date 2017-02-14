import {binding as steps, given, when, then} from "cucumber-tsflow";
import {ICucumberStepHelper} from "../clusters/i-cucumber-step-helper";
import {PromisedAssertion} from "../chai-as-promised/promised-assertion";
declare const $:ICucumberStepHelper;
declare const module:any;

@steps()
export class MFSSteps {

    @given(/^I set the mfs instance to "([^"]*)"$/)
    setMFSInstance(mfsInstances:string):PromisedAssertion {
        const futureSSHResult = $.clusterUnderTest.nodes.first.executeShellCommand(`maprcli config save -values '{"multimfs.numinstances.pernode":"${mfsInstances}}'`);
        return $.expect(futureSSHResult).to.eventually.be.fulfilled;
    }
}
module.exports = MFSSteps;