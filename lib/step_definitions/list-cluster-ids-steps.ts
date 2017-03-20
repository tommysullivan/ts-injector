import {IProcessResult} from "../node-js-wrappers/i-process-result";
import {PromisedAssertion} from "../chai-as-promised/promised-assertion";
import {ICucumberStepHelper} from "../clusters/i-cucumber-step-helper";

declare const $:ICucumberStepHelper;
declare const module:any;

module.exports = function() {
    let processResult:IProcessResult;

    this.Before(function () {
        processResult = undefined;
    });

    this.When(/^I run "([^"]*)" from the command line$/, (commandLine:string):PromisedAssertion => {
        return $.expect(
            $.process.executeNodeProcess(commandLine, $.process.environmentVariables)
                .then(result => processResult = result)
        ).to.eventually.be.fulfilled;
    });

    this.Then(/^the output returns a non\-empty array of cluster ids$/, () => {
        const output = processResult.allOutputLines.join('');
        const jsonPartOfOUtput = output.substr(output.indexOf('['));
        $.console.log(jsonPartOfOUtput);
        $.expect($.typedJSON.jsonParser.parse(jsonPartOfOUtput)).not.to.be.empty;
    });

};