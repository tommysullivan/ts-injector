import IList from "../collections/i-list";
import INode from "./i-node";
import IClusterVersionGraph from "./../versioning/i-cluster-version-graph";
import IThenable from "../promise/i-thenable";
import IESXIAction from "../esxi/i-esxi-action";
import ISSHResult from "../ssh/i-ssh-result";
import IESXIResponse from "../esxi/i-esxi-response";
import IInstallerRestSession from "../installer/i-installer-rest-session";
import MCSRestSession from "../mcs/mcs-rest-session";
import OpenTSDBRestClient from "../open-tsdb/open-tsdb-rest-client";
import ElasticSearchRestClient from "../elasticsearch/elasticsearch-rest-client";

interface IClusterUnderTest {
    installationTimeoutInMilliseconds:number;
    newAuthedMCSSession():IThenable<MCSRestSession>;
    newAuthedInstallerSession():IThenable<IInstallerRestSession>;
    newOpenTSDBRestClient():IThenable<OpenTSDBRestClient>;
    newElasticSearchClient():IThenable<ElasticSearchRestClient>;
    isManagedByESXI():boolean;
    revertToState(stateName:string):IThenable<IESXIResponse>;
    deleteSnapshotsWithStateName(stateName:string):IThenable<IESXIResponse>;
    snapshotInfo():IThenable<IESXIResponse>;
    captureSnapshotNamed(stateName:string):IThenable<IESXIResponse>;
    verifyMapRNotInstalled():IThenable<IList<ISSHResult>>;
    nodes():IList<INode>;
    nodesHosting(serviceName:string):IList<INode>;
    nodeHosting(serviceName:string):INode;
    nodeWithHostName(hostName:string):INode;
    executeShellCommandsOnEachNode(commands:IList<string>):IThenable<any>;
    versionGraph():IThenable<IClusterVersionGraph>;
    name:string;
}

export default IClusterUnderTest;