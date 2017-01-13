import { binding as steps, given, when, then } from "cucumber-tsflow";
import {PromisedAssertion} from "../chai-as-promised/promised-assertion";
import {IFramework} from "../framework/common/i-framework";

declare const $:IFramework;
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