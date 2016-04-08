import IThenable from "../promise/i-thenable";
import IList from "../collections/i-list";
import INodeVersionGraph from "./../versioning/i-node-version-graph";
import ISSHResult from "../ssh/i-ssh-result";
import ISSHSession from "../ssh/i-ssh-session";
import MCSRestSession from "../mcs/mcs-rest-session";
import IInstallerRestSession from "../installer/i-installer-rest-session";
import OpenTSDBRestClient from "../open-tsdb/open-tsdb-rest-client";
import ElasticSearchRestClient from "../elasticsearch/elasticsearch-rest-client";

interface INode {
    host:string;
    repoUrlFor(componentFamily:string):string;
    newSSHSession():IThenable<ISSHSession>
    verifyMapRNotInstalled():IThenable<ISSHResult>;
    isHostingService(serviceName:string):boolean;
    newAuthedMCSSession():IThenable<MCSRestSession>;
    newAuthedInstallerSession():IThenable<IInstallerRestSession>;
    newOpenTSDBRestClient():OpenTSDBRestClient;
    newElasticSearchClient():ElasticSearchRestClient;
    executeShellCommands(shellCommands:IList<string>):IThenable<IList<ISSHResult>>;
    versionGraph():IThenable<INodeVersionGraph>;
}

export default INode;