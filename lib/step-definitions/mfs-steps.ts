import {binding as steps, given, when, then} from "cucumber-tsflow";
import Framework from "../framework/framework";
import {PromisedAssertion} from "../chai-as-promised/promised-assertion";
declare var $:Framework;
declare var module:any;

@steps()
export default class MFSSteps {

    @given(/^I set the mfs instance to "([^"]*)"$/)
    setMFSInstance(mfsInstances:string):PromisedAssertion {
        var futureSSHResult = $.clusterUnderTest.nodes().first().executeShellCommand(`maprcli config save -values '{"multimfs.numinstances.pernode":"${mfsInstances}}'`);
        return $.expect(futureSSHResult).to.eventually.be.fulfilled;
    }
}
module.exports = MFSSteps;