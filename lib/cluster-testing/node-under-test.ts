import {INodeConfiguration} from "./../nodes/i-node-configuration";
import {ISSHClient} from "../ssh/i-ssh-client";
import {ISSHSession} from "../ssh/i-ssh-session";
import {IList} from "../collections/i-list";
import {INodeVersionGraph} from "./../versioning/i-node-version-graph";
import {IPromiseFactory} from "../promise/i-promise-factory";
import {IFuture} from "../promise/i-future";
import {IOperatingSystem} from "./../operating-systems/i-operating-system";
import {ISSHResult} from "../ssh/i-ssh-result";
import {INodeUnderTest} from "./i-node-under-test";
import {ISSHError} from "../ssh/i-ssh-error";
import {IInstallerRestSession} from "../installer/i-installer-rest-session";
import {IVersioning} from "../versioning/i-versioning";
import {IPackageManager} from "../packaging/i-package-manager";
import {IPackaging} from "../packaging/i-packaging";
import {IPackage} from "../packaging/i-package";
import {IPhase} from "../releasing/i-phase";
import {IOpenTSDBRestClient} from "../open-tsdb/i-open-tsdb-rest-client";
import {IElasticsearchRestClient} from "../elasticsearch/i-elasticsearch-rest-client";
import {IElasticsearch} from "../elasticsearch/i-elasticsearch";
import {IInstaller} from "../installer/i-installer";
import {IOpenTSDB} from "../open-tsdb/i-open-tsdb";
import {IMCS} from "../mcs/i-mcs";
import {IMCSRestSession} from "../mcs/i-mcs-rest-session";
import {ICollections} from "../collections/i-collections";
import {IOperatingSystems} from "../operating-systems/i-operating-systems";

export class NodeUnderTest implements INodeUnderTest {
    constructor(
        private nodeConfiguration:INodeConfiguration,
        private sshClient:ISSHClient,
        private promiseFactory:IPromiseFactory,
        private mcs:IMCS,
        private openTSDB:IOpenTSDB,
        private installer:IInstaller,
        private elasticSearch:IElasticsearch,
        private versioning:IVersioning,
        private packaging:IPackaging,
        private releasePhase:IPhase,
        private collections:ICollections,
        private operatingSystems:IOperatingSystems
    ) {}

    executeShellCommandWithTimeouts(shellCommand:string, timeout:number, maxTry:number):IFuture<ISSHResult> {
        return this.newSSHSession().then(s=>s.executeCommandWithRetryTimeout(shellCommand, timeout, maxTry));
    }

    writeBinaryData(content:ArrayBuffer, remotePath:string):IFuture<ISSHResult> {
        return this.newSSHSession()
            .then(sshSession=>sshSession.writeAsBinary(content, remotePath));
    }

    readAsBinary(remotePath:string):IFuture<ArrayBuffer> {
        return this.newSSHSession()
            .then(sshSession=>sshSession.readAsBinary(remotePath));
    }

    read(remotePath:string):IFuture<string> {
        return this.newSSHSession()
            .then(sshSession=>sshSession.read(remotePath));
    }

    get packageManager():IPackageManager {
        return this.packaging.packageManagerFor(this.operatingSystem.name);
    }

    get hostNameAccordingToNode():IFuture<string> {
        return this.executeShellCommand('hostname')
            .then(r=>r.processResult.stdoutLines.first);
    }

    newSSHSession():IFuture<ISSHSession> {
        return this.sshClient.connect(
            this.nodeConfiguration.host,
            this.nodeConfiguration.username,
            this.nodeConfiguration.password
        );
    }

    executeShellCommand(shellCommand:string):IFuture<ISSHResult> {
        return this.newSSHSession().then(s=>s.executeCommand(shellCommand));
    }

    executeShellCommands(...commandsWithPlaceholders:Array<string>):IFuture<IList<ISSHResult>> {
        const commands = commandsWithPlaceholders.map(
            c=>c.replace('{{packageCommand}}', this.packageManager.packageCommand)
        );
        return this.newSSHSession()
            .then(sshSession => sshSession.executeCommands(...commands));
    }
    
    upload(localPath:string, remotePath:string):IFuture<ISSHResult>{
        return this.newSSHSession()
            .then(sshSession => sshSession.upload(localPath, remotePath));
    }

    download(remotePath:string, localPath:string):IFuture<ISSHResult>{
        return this.newSSHSession()
            .then(sshSession => sshSession.download(remotePath, localPath));
    }

    write(content:string, remotePath:string):IFuture<ISSHResult> {
        return this.newSSHSession()
            .then(sshSession=>sshSession.write(content, remotePath));
    }

    verifyMapRNotInstalled():IFuture<ISSHResult> {
        return this.promiseFactory.newPromise((resolve, reject) => {
            this.newSSHSession()
                .then(sshSession => {
                    return sshSession.executeCommand('ls /opt/mapr');
                })
                .then(shellCommandResult=>{
                    reject(new Error(`/opt/mapr directory exists on host ${this.nodeConfiguration.host}`))
                })
                .catch((sshError:ISSHError) => {
                    const processResult = sshError.sshResult ? sshError.sshResult.processResult : null;
                    if(processResult && processResult.processExitCode==2) {
                        resolve(sshError.sshResult);
                    }
                    else {
                        const errorMessage = [
                            `Could not determine if /opt/mapr exists on host ${this.nodeConfiguration.host}.`,
                            `Result: ${sshError.toString()}`
                        ].join('');
                        reject(new Error(errorMessage));
                    }
                });
        });
    }

    verifyMapRIsInstalled():IFuture<ISSHResult> {
        return this.promiseFactory.newPromise((resolve, reject) => {
            this.newSSHSession()
                .then(sshSession => {
                    return sshSession.executeCommand('ls /opt/mapr');
                })
                .then(shellCommandResult=> {
                    resolve(shellCommandResult);
                })
                .catch((sshError:ISSHError) => {
                    const errorMessage = [
                        `Could not determine if /opt/mapr exists on host ${this.nodeConfiguration.host}.`,
                        `Result: ${sshError.toString()}`
                    ].join('');
                    reject(new Error(errorMessage));
                });
        });
    }

    newAuthedMCSSession():IFuture<IMCSRestSession> {
        return this.mcs.newMCSClient(this.host).createAutheticatedSession(this.username, this.password);
    }

    newOpenTSDBRestClient():IOpenTSDBRestClient {
        return this.openTSDB.newOpenTSDBRestClient(this.host);
    }

    newAuthedInstallerSession():IFuture<IInstallerRestSession> {
        return this.installer.newInstallerClient().createAutheticatedSession(
            `https://${this.host}:9443`, this.username, this.password
        );
    }

    newElasticSearchClient():IElasticsearchRestClient {
        return this.elasticSearch.newElasticSearchClient(this.host);
    }

    versionGraph():IFuture<INodeVersionGraph> {
        return this.newSSHSession()
            .then(shellSession=>shellSession.executeCommands(
                this.packageManager.packageListCommand,
                this.packageManager.repoListCommand
            ))
            .then(commandResultSet=>this.versioning.newNodeVersionGraph(this.host, commandResultSet));
    }

    get host():string {
        return this.nodeConfiguration.host;
    }

    get username():string {
        return this.nodeConfiguration.username;
    }

    get password():string {
        return this.nodeConfiguration.password;
    }

    get operatingSystem():IOperatingSystem {
        return this.operatingSystems.newOperatingSystemFromConfig(
            this.nodeConfiguration.operatingSystem
        );
    }

    private get listOfServiceNames():IList<string> {
        return this.collections.newList(this.nodeConfiguration.serviceNames);
    }

    isHostingService(serviceName:string):boolean {
        return this.listOfServiceNames.contain(serviceName);
    }

    get serviceNames():IList<string> {
        return this.listOfServiceNames.clone();
    }

    toJSON():any {
        return this.nodeConfiguration.toJSON();
    }

    get packages():IList<IPackage> {
        return this.releasePhase.packages.filter(
            p=>this.isHostingService(p.name)
        );
    }
}