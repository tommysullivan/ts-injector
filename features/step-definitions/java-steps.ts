import { binding as steps, given, when, then } from "cucumber-tsflow";
import Framework from "../../lib/framework/framework";
import PromisedAssertion = Chai.PromisedAssertion;
declare var $:Framework;
declare var module:any;

@steps()
export default class JavaSteps {
    @given(/^I have installed Java$/)
    installJava():PromisedAssertion {
        return $.expectAll(
            $.clusterUnderTest.nodes().map(n=>n.executeShellCommand(n.packageManager.installJavaCommand))
        ).to.eventually.be.fulfilled;
    }
}
module.exports = JavaSteps;