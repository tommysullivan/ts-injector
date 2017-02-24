import {INode} from "../clusters/i-node";
import {IFuture} from "../futures/i-future";
import {IList} from "../collections/i-list";
import {IPackageManager} from "../packaging/i-package-manager";
import {IOperatingSystem} from "../operating-systems/i-operating-system";
import {IPackage} from "../packaging/i-package";
import {ISSHSession} from "../ssh/i-ssh-session";
import {ISSHResult} from "../ssh/i-ssh-result";
import {IMCSRestSession} from "../mcs/i-mcs-rest-session";
import {IInstallerRestSession} from "../installer/i-installer-rest-session";
import {IOpenTSDBRestClient} from "../open-tsdb/i-open-tsdb-rest-client";
import {IElasticsearchRestClient} from "../elasticsearch/i-elasticsearch-rest-client";
import {INodeVersionGraph} from "../versioning/i-node-version-graph";
import {ISSHClient} from "../ssh/i-ssh-client";
import {IMCS} from "../mcs/i-mcs";
import {IInstaller} from "../installer/i-installer";
import {IOpenTSDB} from "../open-tsdb/i-open-tsdb";
import {IElasticsearch} from "../elasticsearch/i-elasticsearch";
import {IVersioning} from "../versioning/i-versioning";
import {IPhase} from "../releasing/i-phase";
import {IOperatingSystems} from "../operating-systems/i-operating-systems";
import {IPackaging} from "../packaging/i-packaging";
import {ISSHError} from "../ssh/i-ssh-error";
import {IFutures} from "../futures/i-futures";

export class MesosNode implements INode {

    constructor(
        private hostIPAddress:string,
        private userName:string,
        private password:string,
        private operatingSystemName:string,
        private sshClient:ISSHClient,
        private mcs:IMCS,
        private installer:IInstaller,
        private openTSDB:IOpenTSDB,
        private elasticSearch:IElasticsearch,
        private versioning:IVersioning,
        private releasePhase:IPhase,
        private operatingSystems:IOperatingSystems,
        private packaging:IPackaging,
        private futures:IFutures,
        private serviceNames?:IList<string>
    ){}

    get host():string {
        return this.hostIPAddress;
    }

    get expectedServiceNames(): IList<string> {
        if(this.serviceNames)
            return this.serviceNames.clone();
        else
            throw new Error(`Not available, Please add service names to the docker template configuration`);
    }

    get hostNameAccordingToNode(): IFuture<string> {
        return this.executeShellCommand('hostname')
            .then(r=>r.processResult.stdoutLines.first);
    }

    get packageManager(): IPackageManager {
        return this.packaging.packageManagerFor(this.operatingSystem.name);
    }

    get operatingSystem(): IOperatingSystem {
        return this.operatingSystems.newOperatingSystemFromConfig(
            {
                name: this.operatingSystemName,
                version: `x.x`
            }
        );
    }

    get  actualServiceNames(): IFuture<IList<string>> {
        return  this.listOfServicesFromMCS;
    }

    get packages(): IList<IPackage>{
        return this.releasePhase.packages.filter(
            p=>this.isHostingService(p.name)
        );
    }

    newSSHSession():IFuture<ISSHSession> {
        return this.sshClient.connect(
            this.host,
            `root`,
            `mapr`
        );
    }

    verifyMapRNotInstalled(): IFuture<ISSHResult> {
        return this.futures.newFuture((resolve, reject) => {
            this.newSSHSession()
                .then(sshSession => {
                    return sshSession.executeCommand('ls /opt/mapr');
                })
                .then(shellCommandResult=>{
                    reject(new Error(`/opt/mapr directory exists on host ${this.host}`))
                })
                .catch((sshError:ISSHError) => {
                    const processResult = sshError.sshResult ? sshError.sshResult.processResult : null;
                    if(processResult && processResult.processExitCode==2) {
                        resolve(sshError.sshResult);
                    }
                    else {
                        const errorMessage = [
                            `Could not determine if /opt/mapr exists on host ${this.host}.`,
                            `Result: ${sshError.toString()}`
                        ].join('');
                        reject(new Error(errorMessage));
                    }
                });
        });
    }

    verifyMapRIsInstalled(): IFuture<ISSHResult> {
        return null;
    }

    isHostingService(serviceName: string): boolean {
        return this.expectedServiceNames.contain(serviceName);
    }

    newAuthedMCSSession(): IFuture<IMCSRestSession> {
        return this.mcs.newMCSClient(this.host).createAutheticatedSession(this.userName, this.password);
    }

    newAuthedInstallerSession(): IFuture<IInstallerRestSession> {
        return this.installer.newInstallerClient().createAutheticatedSession(
            `https://${this.host}:9443`, this.userName, this.password
        );
    }

    newOpenTSDBRestClient(): IOpenTSDBRestClient {
        return this.openTSDB.newOpenTSDBRestClient(this.host);
    }

    newElasticSearchClient(): IElasticsearchRestClient {
        return this.elasticSearch.newElasticSearchClient(this.host);
    }

    executeShellCommands(...commandsWithPlaceholders): IFuture<IList<ISSHResult>> {
        const commands = commandsWithPlaceholders.map(
            c=>c.replace('{{packageCommand}}', this.packageManager.packageCommand)
        );
        return this.newSSHSession()
            .then(sshSession => sshSession.executeCommands(...commands));
    }

    executeShellCommand(shellCommand:string):IFuture<ISSHResult> {
        return this.newSSHSession().then(s=>s.executeCommand(shellCommand));
    }

    versionGraph(): IFuture<INodeVersionGraph> {
        return this.newSSHSession()
            .then(shellSession=>shellSession.executeCommands(
                this.packageManager.packageListCommand,
                this.packageManager.repoListCommand
            ))
            .then(commandResultSet=>this.versioning.newNodeVersionGraph(this.host, commandResultSet));
    }

    upload(localPath: string, remotePath: string): IFuture<void> {
        return this.newSSHSession()
            .then(sshSession => sshSession.upload(localPath, remotePath));
    }

    write(content: string, remotePath: string): IFuture<void> {
        return this.newSSHSession()
            .then(sshSession=>sshSession.write(content, remotePath));
    }

    download(remotePath: string, localPath: string): IFuture<void> {
        return this.newSSHSession()
            .then(sshSession => sshSession.download(remotePath, localPath));
    }

    executeShellCommandWithTimeouts(shellCommand: string, timeout: number, maxTry: number): IFuture<ISSHResult> {
        return this.newSSHSession().then(s=>s.executeCommandWithRetryTimeout(shellCommand, timeout, maxTry));
    }

    writeBinaryData(content: ArrayBuffer, remotePath: string):IFuture<void> {
        return this.newSSHSession()
            .then(sshSession=>sshSession.writeAsBinary(content, remotePath));
    }

    read(remotePath: string): IFuture<string> {
        return this.newSSHSession()
            .then(sshSession=>sshSession.read(remotePath));
    }

    readAsBinary(remotePath: string): IFuture<ArrayBuffer> {
        return this.newSSHSession()
            .then(sshSession=>sshSession.readAsBinary(remotePath));
    }

    newSSHSessionAsUser(username: string, password: string): IFuture<ISSHSession> {
        return this.sshClient.connect(
            this.host,
            username,
            password
        );
    }

    executeShellCommandAsUser(shellCommand: string, username: string, password: string): IFuture<ISSHResult> {
        return this.newSSHSessionAsUser(username, password).then(s=>s.executeCommand(shellCommand));
    }

    get listOfServicesFromMCS():IFuture<IList<string>> {
        return this.newAuthedMCSSession()
            .then(mcsSession => mcsSession.dashboardInfo)
            .then(dashboardInfo => dashboardInfo.services.map(service => service.name));
    }


}