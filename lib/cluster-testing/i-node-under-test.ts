import IThenable from "../promise/i-thenable";
import IList from "../collections/i-list";
import INodeVersionGraph from "./../versioning/i-node-version-graph";
import ISSHResult from "../ssh/i-ssh-result";
import ISSHSession from "../ssh/i-ssh-session";
import MCSRestSession from "../mcs/mcs-rest-session";
import IInstallerRestSession from "../installer/i-installer-rest-session";
import OpenTSDBRestClient from "../open-tsdb/open-tsdb-rest-client";
import ElasticSearchRestClient from "../elasticsearch/elasticsearch-rest-client";
import IRepository from "../packaging/i-repository";
import IPackageManager from "../packaging/i-package-manager";
import IOperatingSystem from "../operating-systems/i-operating-system";
import IPackage from "../packaging/i-package";

interface INodeUnderTest {
    host:string;
    newSSHSession():IThenable<ISSHSession>
    verifyMapRNotInstalled():IThenable<ISSHResult>;
    verifyMapRIsInstalled():IThenable<ISSHResult>;
    isHostingService(serviceName:string):boolean;
    serviceNames:IList<string>;
    newAuthedMCSSession():IThenable<MCSRestSession>;
    newAuthedInstallerSession():IThenable<IInstallerRestSession>;
    newOpenTSDBRestClient():OpenTSDBRestClient;
    newElasticSearchClient():ElasticSearchRestClient;
    executeShellCommands(shellCommands:IList<string>):IThenable<IList<ISSHResult>>;
    executeShellCommand(shellCommand:string):IThenable<ISSHResult>;
    versionGraph():IThenable<INodeVersionGraph>;
    hostNameAccordingToNode:IThenable<string>;
    packageManager:IPackageManager;
    upload(localPath:string, remotePath:string):IThenable<ISSHResult>;
    write(content:string, remotePath:string):IThenable<ISSHResult>;
    download(remotePath:string, localPath:string):IThenable<ISSHResult>;
    operatingSystem:IOperatingSystem;
    packages:IList<IPackage>;
}

export default INodeUnderTest;