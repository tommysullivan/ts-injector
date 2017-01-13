import {IList} from "../collections/i-list";
import {INode} from "./i-node";
import {IClusterVersionGraph} from "../versioning/i-cluster-version-graph";
import {IFuture} from "../futures/i-future";
import {ISSHResult} from "../ssh/i-ssh-result";
import {IESXIResponse} from "../esxi/i-esxi-response";
import {IInstallerRestSession} from "../installer/i-installer-rest-session";
import {MCSRestSession} from "../mcs/mcs-rest-session";
import {OpenTSDBRestClient} from "../open-tsdb/open-tsdb-rest-client";
import {ElasticSearchRestClient} from "../elasticsearch/elasticsearch-rest-client";
import {IESXIServerConfiguration} from "../esxi/configuration/i-esxi-server-configuration";

export interface ICluster {
    newAuthedMCSSession():IFuture<MCSRestSession>;
    newAuthedInstallerSession():IFuture<IInstallerRestSession>;
    newOpenTSDBRestClient():IFuture<OpenTSDBRestClient>;
    newElasticSearchClient():IFuture<ElasticSearchRestClient>;
    isManagedByESXI:boolean;
    esxiServerConfiguration:IESXIServerConfiguration;
    revertToState(stateName:string):IFuture<IESXIResponse>;
    deleteSnapshotsWithStateName(stateName:string):IFuture<IESXIResponse>;
    snapshotInfo():IFuture<IESXIResponse>;
    captureSnapshotNamed(stateName:string):IFuture<IESXIResponse>;
    verifyMapRNotInstalled():IFuture<IList<ISSHResult>>;
    nodes:IList<INode>;
    powerOff():IFuture<IESXIResponse>;
    nodesHosting(serviceName:string):IList<INode>;
    nodeHosting(serviceName:string):INode;
    nodeWithHostName(hostName:string):INode;
    executeShellCommandsOnEachNode(...commands:Array<string>):IFuture<IList<IList<ISSHResult>>>;
    executeShellCommandOnEachNode(command:string):IFuture<IList<ISSHResult>>;
    versionGraph():IFuture<IClusterVersionGraph>;
    uploadToEachNode(localPath:string, remotePath:string):IFuture<IList<ISSHResult>>;
    name:string;
    isHostingService(serviceName:string):boolean;
}