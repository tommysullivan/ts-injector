import { binding as steps, given } from "cucumber-tsflow";
import Framework from "../../lib/framework/framework";
import PromisedAssertion = Chai.PromisedAssertion;
declare var $:Framework;
declare var module:any;

@steps()
export default class UserSteps {
    @given(/^I create the user "([^"]*)" with id "([^"]*)" group "([^"]*)" and password "([^"]*)"$/)
    createNewLinuxUser(username:string, numericUserId:string, userGroupName:string, password:string):PromisedAssertion {
        var userCreateComamnd = `id -u ${username} || useradd -u ${numericUserId} -g ${userGroupName} -p $(openssl passwd -1 ${password}) ${username}`;
        var groupCreateCommand = `getent group ${userGroupName} || groupadd -g ${numericUserId} ${username}`;
        var resultList = $.clusterUnderTest.nodes().map(
            n => n.executeShellCommands(
                $.collections.newList([groupCreateCommand,userCreateComamnd])
            )
        );
        return $.expectAll(resultList).to.eventually.be.fulfilled;
    }
}
module.exports = UserSteps;