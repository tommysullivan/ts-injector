import { binding as steps, given, when, then } from "cucumber-tsflow";
import {Framework} from "../framework/framework";
import {PromisedAssertion} from "../chai-as-promised/promised-assertion";
declare const $:Framework;
declare const module:any;

@steps()
export class JavaSteps {
    @given(/^I have installed Java$/)
    installJava():PromisedAssertion {
        return $.expectAll(
            $.clusterUnderTest.nodes.map(n=>n.executeShellCommand(n.packageManager.installJavaCommand))
        ).to.eventually.be.fulfilled;
    }
}
module.exports = JavaSteps;