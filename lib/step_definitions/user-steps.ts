import {PromisedAssertion} from "../chai-as-promised/promised-assertion";
import {ICucumberStepHelper} from "../clusters/i-cucumber-step-helper";

declare const $:ICucumberStepHelper;
declare const module:any;

module.exports = function() {
    this.Given(/^I create the user "([^"]*)" with id "([^"]*)" group "([^"]*)" and password "([^"]*)"$/, (username:string, numericUserId:string, userGroupName:string, password:string):PromisedAssertion => {
        const userCreateComamnd = `id -u ${username} || useradd -u ${numericUserId} -g ${userGroupName} -p $(openssl passwd -1 ${password}) ${username}`;
        const groupCreateCommand = `getent group ${userGroupName} || groupadd -g ${numericUserId} ${userGroupName}`;
        const resultList = $.clusterUnderTest.nodes.map(
            n => n.executeShellCommands(
                groupCreateCommand,
                userCreateComamnd
            )
        );
        return $.expectAll(resultList).to.eventually.be.fulfilled;
    });
};