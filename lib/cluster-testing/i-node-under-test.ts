import {IFuture} from "../promise/i-future";
import {IList} from "../collections/i-list";
import {INodeVersionGraph} from "./../versioning/i-node-version-graph";
import {ISSHResult} from "../ssh/i-ssh-result";
import {ISSHSession} from "../ssh/i-ssh-session";
import {IInstallerRestSession} from "../installer/i-installer-rest-session";
import {IPackageManager} from "../packaging/i-package-manager";
import {IOperatingSystem} from "../operating-systems/i-operating-system";
import {IPackage} from "../packaging/i-package";
import {IMCSRestSession} from "../mcs/i-mcs-rest-session";
import {IOpenTSDBRestClient} from "../open-tsdb/i-open-tsdb-rest-client";
import {IElasticsearchRestClient} from "../elasticsearch/i-elasticsearch-rest-client";

export interface INodeUnderTest {
    host:string;
    newSSHSession():IFuture<ISSHSession>
    verifyMapRNotInstalled():IFuture<ISSHResult>;
    verifyMapRIsInstalled():IFuture<ISSHResult>;
    isHostingService(serviceName:string):boolean;
    serviceNames:IList<string>;
    newAuthedMCSSession():IFuture<IMCSRestSession>;
    newAuthedInstallerSession():IFuture<IInstallerRestSession>;
    newOpenTSDBRestClient():IOpenTSDBRestClient;
    newElasticSearchClient():IElasticsearchRestClient;
    executeShellCommands(...shellCommands:Array<string>):IFuture<IList<ISSHResult>>;
    executeShellCommand(shellCommand:string):IFuture<ISSHResult>;
    versionGraph():IFuture<INodeVersionGraph>;
    hostNameAccordingToNode:IFuture<string>;
    packageManager:IPackageManager;
    upload(localPath:string, remotePath:string):IFuture<ISSHResult>;
    write(content:string, remotePath:string):IFuture<ISSHResult>;
    download(remotePath:string, localPath:string):IFuture<ISSHResult>;
    operatingSystem:IOperatingSystem;
    packages:IList<IPackage>;
    executeShellCommandWithTimeouts(shellCommand:string, timeout:number, maxTry:number):IFuture<ISSHResult>;
    writeBinaryData(content:ArrayBuffer, remotePath:string):IFuture<ISSHResult>;
    read(remotePath:string):IFuture<string>;
    readAsBinary(remotePath:string):IFuture<ArrayBuffer>;
}