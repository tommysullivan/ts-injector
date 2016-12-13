import {binding as steps, when, then} from "cucumber-tsflow";
import {Framework} from "../framework/framework";
import {IProcessResult} from "../node-js-wrappers/i-process-result";
import {PromisedAssertion} from "../chai-as-promised/promised-assertion";
declare const $:Framework;
declare const module:any;

@steps()
export class ListClusterIdsSteps {
    private processResult:IProcessResult;

    @when(/^I run "([^"]*)" from the command line$/)
    public WhenIRunFromCommandLine(commandLine:string):PromisedAssertion {
        return $.expect(
            $.process.executeNodeProcess(commandLine, $.process.environmentVariables)
                .then(processResult => this.processResult = processResult)
        ).to.eventually.be.fulfilled;
    }

    @then(/^the output returns a non\-empty array of cluster ids$/)
    public clusterIdsAreInOutput():void {
        const output = this.processResult.allOutputLines.join('');
        const jsonPartOfOUtput = output.substr(output.indexOf('['));
        $.console.log(jsonPartOfOUtput);
        $.expect(JSON.parse(jsonPartOfOUtput)).not.to.be.empty;
    }

}
module.exports = ListClusterIdsSteps;