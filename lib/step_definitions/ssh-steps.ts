import {PromisedAssertion} from "../chai-as-promised/promised-assertion";
import {ICucumberStepHelper} from "../clusters/i-cucumber-step-helper";
import {INode} from "../clusters/i-node";
import {ICustomWorld} from "../cucumber/i-custom-world";
import {ISSHSession} from "../ssh/i-ssh-session";

declare const $:ICucumberStepHelper;
declare const module:any;

module.exports = function() {

    //TODO: lifecycle of these now crosses scenario boundaries!!!
    let sshSession:ISSHSession;
    let sshServiceHost:INode;

    this.Before(function () {
        sshSession = undefined;
        sshServiceHost = undefined;
    });

    this.When(/^I perform the following ssh commands on each node in the cluster:$/, (commandsSeparatedByNewLine:string):PromisedAssertion => {
        const commandList = commandsSeparatedByNewLine.split("\n");
        return $.expect($.clusterUnderTest.executeShellCommandsOnEachNode(...commandList))
            .to.eventually.be.fulfilled;
    });

    this.When(/^I ssh into the node hosting "([^"]*)"$/, (serviceName:string):PromisedAssertion  => {
        sshServiceHost = $.clusterUnderTest.nodeHosting(serviceName);
        const sshSessionRequest = sshServiceHost.newSSHSession()
            .then(newSSHSession => sshSession = newSSHSession);
        return $.expect(sshSessionRequest).to.eventually.be.fulfilled;
    });

    this.When(/^I run the following commands on any given node in the cluster:$/, function(this:ICustomWorld, commandsString:string):PromisedAssertion {
        const commands = commandsString.split("\n")
            .map(c=>c.replace('{testRunGUID}', $.testRunGUID).replace('{volumeMountPoint}', this.sharedData.mountPath));
        const result = $.clusterUnderTest.nodes.first.newSSHSession()
            .then(sshSession=>sshSession.executeCommands(...commands))
            .then(commandResultSet=>this.sharedData.lastCommandResultSet = commandResultSet);
        return $.expect(result).to.eventually.be.fulfilled;
    });

    this.When(/^I scp "([^"]*)" to "([^"]*)" on each node in the cluster$/, (localPath:string, remotePath:string):PromisedAssertion => {
        const result = $.clusterUnderTest.uploadToEachNode(localPath, remotePath);
        return $.expect(result).to.eventually.to.fulfilled;
    });

    this.Given(/^I perform the following ssh commands on each node in the cluster as user "([^"]*)" with password "([^"]*)":$/,
        (user:string, userPasswd:string, commandsSeparatedByNewLine:string):PromisedAssertion => {
        const commands = commandsSeparatedByNewLine.split("\n");
        const nodeRequests = $.clusterUnderTest.nodes.map(n=>{
            return $.sshAPI.newSSHClient().connect(n.host, user, userPasswd)
                .then(session=>session.executeCommands(...commands))
        });
        return $.expectAll(nodeRequests).to.eventually.be.fulfilled;
    });

    this.Given(/^perform the following ssh commands on the first node in the cluster as user "([^"]*)" with password "([^"]*)":$/,(user:string, userPasswd:string, commandsSeparatedByNewLine:string):PromisedAssertion => {
        const commands = commandsSeparatedByNewLine.split("\n");
        const firstNode = $.clusterUnderTest.nodes.first;
        const sshResult = firstNode.newSSHSessionAsUser(user,userPasswd)
                .then(session=>session.executeCommands(...commands));
        return $.expect(sshResult).to.eventually.be.fulfilled;
    },3600000);

    this.Given(/^I run the following commands on nodes hosting "([^"]*)" in the cluster:$/, (serviceName:string, commandsString:string):PromisedAssertion => {
        const result = $.clusterUnderTest.nodesHosting(serviceName).mapToFutureList(
            n => n.executeShellCommands(...commandsString.split("\n"))
        );
        return $.expect(result).to.eventually.be.fulfilled;
    });
};