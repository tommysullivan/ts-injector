import { binding as steps, given, when, then } from "cucumber-tsflow";
import Framework from "../../lib/framework/framework";
import INodeUnderTest from "../../lib/cluster-testing/i-node-under-test";
import ISSHSession from "../../lib/ssh/i-ssh-session";
import ISSHResult from "../../lib/ssh/i-ssh-result";
import ISSHError from "../../lib/ssh/i-ssh-error";
import IList from "../../lib/collections/i-list";
import {PromisedAssertion} from "../../lib/chai-as-promised/promised-assertion";

declare var $:Framework;
declare var module:any;

@steps()
export default class SSHSteps {
    private sshServiceHost:INodeUnderTest;
    private sshSession:ISSHSession;
    private sshResult:ISSHResult;
    private mountPath:string;
    private lastCommandResultSet:IList<ISSHResult>;

    @when(/^I perform the following ssh commands on each node in the cluster:$/)
    performSSHCommandsOnEachNodeInTheCluster(commandsSeparatedByNewLine:string):PromisedAssertion {
        var commandList = $.collections.newList(commandsSeparatedByNewLine.split("\n"));
        return $.expect($.clusterUnderTest.executeShellCommandsOnEachNode(commandList))
            .to.eventually.be.fulfilled;
    }

    @when(/^I ssh into the node hosting "([^"]*)"$/)
    sshIntoNodeHostingService(serviceName:string):PromisedAssertion {
        this.sshServiceHost = $.clusterUnderTest.nodeHosting(serviceName);
        var sshSessionRequest = this.sshServiceHost.newSSHSession()
            .then(sshSession => this.sshSession = sshSession);
        return $.expect(sshSessionRequest).to.eventually.be.fulfilled;
    }

    @when(/^within my ssh session, I download "([^"]*)" to "([^"]*)" from the repository for the "([^"]*)" package family/)
    downloadFromPackageFamilyRepoViaCurlUsingExistingSSHSession(fileToRetrieve:string, destinationDirectory:string, packageFamily:string):PromisedAssertion {
        throw new Error('not impl');
        // var commands = $.collections.newList<string>([
        //     `curl ${this.sshServiceHost.repositoryForPackageFamily(packageFamily).url}${fileToRetrieve} > ${destinationDirectory}${fileToRetrieve}`,
        //     `chmod 744 ${destinationDirectory}${fileToRetrieve}`
        // ]);
        // return $.expect(this.sshSession.executeCommands(commands)).to.eventually.be.fulfilled;
    }

    @when(/^within my ssh session, I execute "([^"]*)"$/)
    executeSSHCommandInExistingSession(sshCommand:string):PromisedAssertion {
        function repoUrlFor(packageFamily:string):string {
            return this.sshServiceHost.repositoryForPackageFamily(packageFamily).url;
        }
        sshCommand = sshCommand.replace('[installerRepoURL]', repoUrlFor('installer'));
        sshCommand = sshCommand.replace('[maprCoreRepoURL]', repoUrlFor('core'));
        sshCommand = sshCommand.replace('[ecosystemRepoURL]', repoUrlFor('ecosystem'));
        var sshRequest = this.sshSession.executeCommand(sshCommand)
            .then(result=>this.sshResult=result)
            .catch(e => {
                var error:ISSHError = e;
                console.log(error.toJSON());
                throw new Error(error.toString());
            });
        return $.expect(sshRequest).to.eventually.be.fulfilled;
    }

    @when(/^I run the following commands on any given node in the cluster:$/)
    runSpecifiedCommandsOnFirstNodeInCluster(commandsString:string):PromisedAssertion {
        var commands = $.collections.newList<string>(commandsString.split("\n"));
        commands = commands.map(c=>c.replace('{testRunGUID}', $.testRunGUID).replace('{volumeMountPoint}', this.mountPath));
        var result = $.clusterUnderTest.nodes().first().newSSHSession()
            .then(sshSession=>sshSession.executeCommands(commands))
            .then(commandResultSet=>this.lastCommandResultSet = commandResultSet);
        return $.expect(result).to.eventually.be.fulfilled;
    }

    @when(/^I scp "([^"]*)" to "([^"]*)" on each node in the cluster$/)
    scpLocalPathToRemotePathOnEachNode(localPath:string, remotePath:string):PromisedAssertion {
        var result = $.clusterUnderTest.uploadToEachNode(localPath, remotePath);
        return $.expect(result).to.eventually.to.fulfilled;
    }

    @given(/^I perform the following ssh commands on each node in the cluster as user "([^"]*)" with password "([^"]*)":$/)
    performSSHCommandsAsSpecficUserOnEachNode(user:string, userPasswd:string, commandsSeparatedByNewLin:string):PromisedAssertion {
        var commandList = $.collections.newList(commandsSeparatedByNewLin.split("\n"));
        var nodeRequests = $.clusterUnderTest.nodes().map(n=>{
            return $.sshAPI.newSSHClient().connect(n.host, user, userPasswd)
                .then(session=>session.executeCommands(commandList))
        });
        return $.expectAll(nodeRequests).to.eventually.be.fulfilled;
    }
}
module.exports = SSHSteps;