import INodeConfiguration from "./../nodes/i-node-configuration";
import ISSHClient from "../ssh/i-ssh-client";
import ISSHSession from "../ssh/i-ssh-session";
import IList from "../collections/i-list";
import INodeVersionGraph from "./../versioning/i-node-version-graph";
import IPromiseFactory from "../promise/i-promise-factory";
import IThenable from "../promise/i-thenable";
import IOperatingSystemConfig from "./../operating-systems/i-operating-system-config";
import ICollections from "../collections/i-collections";
import ISSHResult from "../ssh/i-ssh-result";
import INode from "./i-node";
import ISSHError from "../ssh/i-ssh-error";
import MCSRestSession from "../mcs/mcs-rest-session";
import MCS from "../mcs/mcs";
import OpenTSDBRestClient from "../open-tsdb/open-tsdb-rest-client";
import OpenTSDB from "../open-tsdb/open-tsdb";
import IInstallerRestSession from "../installer/i-installer-rest-session";
import ElasticSearchRestClient from "../elasticsearch/elasticsearch-rest-client";
import Installer from "../installer/installer";
import ElasticSearch from "../elasticsearch/elasticsearch";
import IVersioning from "../versioning/i-versioning";
import IRepository from "../repositories/i-repository";

export default class NodeUnderTest implements INode {
    private nodeConfiguration:INodeConfiguration;
    private sshClient:ISSHClient;
    private promiseFactory:IPromiseFactory;
    private collections:ICollections;
    private mcs:MCS;
    private openTSDB:OpenTSDB;
    private installer:Installer;
    private elasticSearch:ElasticSearch;
    private versioning:IVersioning;

    constructor(nodeConfiguration:INodeConfiguration, sshClient:ISSHClient, promiseFactory:IPromiseFactory, collections:ICollections, mcs:MCS, openTSDB:OpenTSDB, installer:Installer, elasticSearch:ElasticSearch, versioning:IVersioning) {
        this.nodeConfiguration = nodeConfiguration;
        this.sshClient = sshClient;
        this.promiseFactory = promiseFactory;
        this.collections = collections;
        this.mcs = mcs;
        this.openTSDB = openTSDB;
        this.installer = installer;
        this.elasticSearch = elasticSearch;
        this.versioning = versioning;
    }

    repoUrlFor(componentFamily:string):string {
        return this.repo.urlFor(componentFamily);
    }

    get repo():IRepository {
        return this.nodeConfiguration.operatingSystem.repository;
    }

    newSSHSession():IThenable<ISSHSession> {
        return this.sshClient.connect(
            this.nodeConfiguration.host,
            this.nodeConfiguration.username,
            this.nodeConfiguration.password
        );
    }

    executeShellCommand(shellCommand:string):IThenable<ISSHResult> {
        return this.newSSHSession().then(s=>s.executeCommand(shellCommand));
    }

    executeShellCommands(commandsWithPlaceholders:IList<string>):IThenable<IList<ISSHResult>> {
        var commands:IList<string> = commandsWithPlaceholders.map(
            c=>c.replace('{{packageCommand}}', this.packageCommand)
        );
        return this.newSSHSession()
            .then(sshSession => sshSession.executeCommands(commands));
    }
    
    executeCopyCommand(localPath:string, remotePath:string):IThenable<ISSHResult>{
        return this.newSSHSession()
            .then(sshSession => sshSession.copyCommand(localPath, remotePath));
    }

    verifyMapRNotInstalled():IThenable<ISSHResult> {
        return this.promiseFactory.newPromise((resolve, reject) => {
            this.newSSHSession()
                .then(sshSession => {
                    return sshSession.executeCommand('ls /opt/mapr');
                })
                .then(shellCommandResult=>{
                    reject(new Error(`/opt/mapr directory exists on host ${this.nodeConfiguration.host}`))
                })
                .catch((sshError:ISSHError) => {
                    var processResult = sshError.sshResult ? sshError.sshResult.processResult() : null;
                    if(processResult && processResult.processExitCode()==2) {
                        resolve(sshError.sshResult);
                    }
                    else {
                        var errorMessage = [
                            `Could not determine if /opt/mapr exists on host ${this.nodeConfiguration.host}.`,
                            `Result: ${sshError.toString()}`
                        ].join('');
                        reject(new Error(errorMessage));
                    }
                });
        });
    }

    verifyMapRIsInstalled():IThenable<ISSHResult> {
        return this.promiseFactory.newPromise((resolve, reject) => {
            this.newSSHSession()
                .then(sshSession => {
                    return sshSession.executeCommand('ls /opt/mapr');
                })
                .then(shellCommandResult=> {
                    resolve(shellCommandResult);
                })
                .catch((sshError:ISSHError) => {
                    var errorMessage = [
                        `Could not determine if /opt/mapr exists on host ${this.nodeConfiguration.host}.`,
                        `Result: ${sshError.toString()}`
                    ].join('');
                    reject(new Error(errorMessage));
                });
        });
    }

    newAuthedMCSSession():IThenable<MCSRestSession> {
        return this.mcs.newMCSClient(this.host).createAutheticatedSession(this.username, this.password);
    }

    newOpenTSDBRestClient():OpenTSDBRestClient {
        return this.openTSDB.newOpenTSDBRestClient(this.host);
    }

    newAuthedInstallerSession():IThenable<IInstallerRestSession> {
        return this.installer.newInstallerClient().createAutheticatedSession(
            `https://${this.host}:9443`, this.username, this.password
        );
    }

    newElasticSearchClient():ElasticSearchRestClient {
        return this.elasticSearch.newElasticSearchClient(this.host);
    }

    versionGraph():IThenable<INodeVersionGraph> {
        var commands = this.collections.newList([
            this.packageListCommand,
            this.repoListCommand
        ]);
        return this.newSSHSession()
            .then(shellSession=>shellSession.executeCommands(commands))
            .then(commandResultSet=>this.versioning.newNodeVersionGraph(this.host, commandResultSet));
    }

    get packageCommand():string {
        return this.operatingSystem.repository.packageCommand;
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

    get operatingSystem():IOperatingSystemConfig {
        return this.nodeConfiguration.operatingSystem;
    }

    get repoListCommand():string {
        return this.operatingSystem.repository.repoListCommand;
    }

    get packageListCommand():string {
        return this.operatingSystem.repository.packageListCommand;
    }

    isHostingService(serviceName:string):boolean {
        return this.nodeConfiguration.serviceNames.contain(serviceName);
    }

    get serviceNames():IList<string> {
        return this.nodeConfiguration.serviceNames.clone();
    }

    toJSON():any {
        return this.nodeConfiguration.toJSON();
    }
}