import { binding as steps, given, when, then } from "cucumber-tsflow";
import {PromisedAssertion} from "../chai-as-promised/promised-assertion";
import {IFramework} from "../framework/common/i-framework";
import {INode} from "../clusters/i-node";
import {ISSHSession} from "../ssh/i-ssh-session";
import {ISSHResult} from "../ssh/i-ssh-result";
import {ISSHError} from "../ssh/i-ssh-error";
import {SharedData} from "../support/shared-data";

declare const $:IFramework;
declare const module:any;

@steps([SharedData])
export class SSHSteps {
    private sshServiceHost:INode;
    private sshSession:ISSHSession;
    private sshResult:ISSHResult;

    constructor(
        private sharedData:SharedData
    ) {}

    @when(/^I perform the following ssh commands on each node in the cluster:$/)
    performSSHCommandsOnEachNodeInTheCluster(commandsSeparatedByNewLine:string):PromisedAssertion {
        const commandList = commandsSeparatedByNewLine.split("\n");
        return $.expect($.clusterUnderTest.executeShellCommandsOnEachNode(...commandList))
            .to.eventually.be.fulfilled;
    }

    @when(/^I ssh into the node hosting "([^"]*)"$/)
    sshIntoNodeHostingService(serviceName:string):PromisedAssertion {
        this.sshServiceHost = $.clusterUnderTest.nodeHosting(serviceName);
        const sshSessionRequest = this.sshServiceHost.newSSHSession()
            .then(sshSession => this.sshSession = sshSession);
        return $.expect(sshSessionRequest).to.eventually.be.fulfilled;
    }

    @when(/^within my ssh session, I download "([^"]*)" to "([^"]*)" from the repository for the "([^"]*)" package family/)
    downloadFromPackageFamilyRepoViaCurlUsingExistingSSHSession(fileToRetrieve:string, destinationDirectory:string, packageFamily:string):PromisedAssertion {
        throw new Error('not impl');
        // const commands = $.collections.newList<string>([
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
        const sshRequest = this.sshSession.executeCommand(sshCommand)
            .then(result=>this.sshResult=result)
            .catch(e => {
                const error:ISSHError = e;
                console.log(error.toString());
                throw new Error(error.toString());
            });
        return $.expect(sshRequest).to.eventually.be.fulfilled;
    }

    @when(/^I run the following commands on any given node in the cluster:$/)
    runSpecifiedCommandsOnFirstNodeInCluster(commandsString:string):PromisedAssertion {
        const commands = commandsString.split("\n")
            .map(c=>c.replace('{testRunGUID}', $.testRunGUID).replace('{volumeMountPoint}', this.sharedData.mountPath));
        const result = $.clusterUnderTest.nodes.first.newSSHSession()
            .then(sshSession=>sshSession.executeCommands(...commands))
            .then(commandResultSet=>this.sharedData.lastCommandResultSet = commandResultSet);
        return $.expect(result).to.eventually.be.fulfilled;
    }

    @when(/^I scp "([^"]*)" to "([^"]*)" on each node in the cluster$/)
    scpLocalPathToRemotePathOnEachNode(localPath:string, remotePath:string):PromisedAssertion {
        const result = $.clusterUnderTest.uploadToEachNode(localPath, remotePath);
        return $.expect(result).to.eventually.to.fulfilled;
    }

    @given(/^I perform the following ssh commands on each node in the cluster as user "([^"]*)" with password "([^"]*)":$/)
    performSSHCommandsAsSpecficUserOnEachNode(user:string, userPasswd:string, commandsSeparatedByNewLine:string):PromisedAssertion {
        const commands = commandsSeparatedByNewLine.split("\n");
        const nodeRequests = $.clusterUnderTest.nodes.map(n=>{
            return $.sshAPI.newSSHClient().connect(n.host, user, userPasswd)
                .then(session=>session.executeCommands(...commands))
        });
        return $.expectAll(nodeRequests).to.eventually.be.fulfilled;
    }

    @given(/^perform the following ssh commands on the first node in the cluster as user "([^"]*)" with password "([^"]*)":$/,null,3600000)
    performSSHCommandsOnFirstNodeAsSpecficUser(user:string, userPasswd:string, commandsSeparatedByNewLine:string):PromisedAssertion {
        const commands = commandsSeparatedByNewLine.split("\n");
        const firstNode = $.clusterUnderTest.nodes.first;
        const sshResult = firstNode.newSSHSessionAsUser(user,userPasswd)
                .then(session=>session.executeCommands(...commands));
        return $.expect(sshResult).to.eventually.be.fulfilled;
    }

    @given(/^I run the following commands on nodes hosting "([^"]*)" in the cluster:$/)
    runCommandsOnNodesHostingService(serviceName:string, commandsString:string):PromisedAssertion {
        const result = $.clusterUnderTest.nodesHosting(serviceName).mapToFutureList(
            n => n.executeShellCommands(...commandsString.split("\n"))
        );
        return $.expect(result).to.eventually.be.fulfilled;
    }
}
module.exports = SSHSteps;