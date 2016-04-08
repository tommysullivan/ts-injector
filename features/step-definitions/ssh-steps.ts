import Framework from "../../lib/framework/framework";
import IClusterVersionGraph from "../../lib/versioning/i-cluster-version-graph";
import ISSHSession from "../../lib/ssh/i-ssh-session";
import INode from "../../lib/cluster-testing/i-node";
import ISSHResult from "../../lib/ssh/i-ssh-result";
import ISSHError from "../../lib/ssh/i-ssh-error";
declare var $:Framework;
declare var module:any;

module.exports = function() {

    this.When(/^I perform the following ssh commands on each node in the cluster:$/, function(commands:string) {
        var commandList = $.collections.newList(commands.split("\n"));
        return $.expect($.clusterUnderTest.executeShellCommandsOnEachNode(commandList))
            .to.eventually.be.fulfilled;
    });

    this.When(/^I ssh into the node hosting "([^"]*)"$/, function (serviceName) {
        this.sshServiceHost = $.clusterUnderTest.nodeHosting(serviceName);
        var sshSessionRequest = this.sshServiceHost.newSSHSession()
            .then(sshSession => this.sshSession = sshSession);
        return $.expect(sshSessionRequest).to.eventually.be.fulfilled;
    });

    this.When(/^within my ssh session, I download "([^"]*)" to "([^"]*)" from the repository for the "([^"]*)" component family/, function (fileToRetrieve, destinationDirectory, componentFamily) {
        var sshSession:ISSHSession = this.sshSession;
        var sshServiceHost:INode = this.sshServiceHost;
        var commands = $.collections.newList<string>([
            `curl ${sshServiceHost.repoUrlFor(componentFamily)}${fileToRetrieve} > ${destinationDirectory}${fileToRetrieve}`,
            `chmod 744 ${destinationDirectory}${fileToRetrieve}`
        ]);
        var sshRequest = sshSession.executeCommands(commands)
            .catch(this.handleError);
        return $.expect(sshRequest).to.eventually.be.fulfilled;
    });

    this.When(/^within my ssh session, I execute "([^"]*)"$/, { timeout: 10 * 60 * 1000 }, function (sshCommand) {
        var sshSession:ISSHSession = this.sshSession;
        var sshServiceHost:INode = this.sshServiceHost;
        sshCommand = sshCommand.replace('[installerRepoURL]', sshServiceHost.repoUrlFor('mapr-installer'));
        sshCommand = sshCommand.replace('[maprCoreRepoURL]', sshServiceHost.repoUrlFor('MapR Core'));
        sshCommand = sshCommand.replace('[ecosystemRepoURL]', sshServiceHost.repoUrlFor('Ecosystem'));
        var sshRequest = sshSession.executeCommand(sshCommand)
            .then(result=>this.sshResult=result)
            .catch((e:ISSHError)=>{
                console.log(e.toJSON());
                throw new Error(e.toString());
            });
        return $.expect(sshRequest).to.eventually.be.fulfilled;
    });

    this.Then(/^it successfully starts the installer web server and outputs its URL to the screen$/, function () {
        var sshResult:ISSHResult = this.sshResult;
        var sshOutput = sshResult.processResult().stdoutLines().join('');
        $.expect(
            sshOutput.indexOf(
                'To continue installing MapR software, open the following URL in a web browser'
            )
        ).not.to.equal(-1);
    });

}