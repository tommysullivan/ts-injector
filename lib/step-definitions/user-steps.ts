import { binding as steps, given } from "cucumber-tsflow";
import {PromisedAssertion} from "../chai-as-promised/promised-assertion";
import {IFramework} from "../framework/common/i-framework";

declare const $:IFramework;
declare const module:any;

@steps()
export class UserSteps {
    @given(/^I create the user "([^"]*)" with id "([^"]*)" group "([^"]*)" and password "([^"]*)"$/)
    createNewLinuxUser(username:string, numericUserId:string, userGroupName:string, password:string):PromisedAssertion {
        const userCreateComamnd = `id -u ${username} || useradd -u ${numericUserId} -g ${userGroupName} -p $(openssl passwd -1 ${password}) ${username}`;
        const groupCreateCommand = `getent group ${userGroupName} || groupadd -g ${numericUserId} ${userGroupName}`;
        const resultList = $.clusterUnderTest.nodes.map(
            n => n.executeShellCommands(
                groupCreateCommand,
                userCreateComamnd
            )
        );
        return $.expectAll(resultList).to.eventually.be.fulfilled;
    }
}
module.exports = UserSteps;