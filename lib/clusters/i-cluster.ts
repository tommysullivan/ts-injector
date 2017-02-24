import {IList} from "../collections/i-list";
import {INode} from "./i-node";
import {IClusterVersionGraph} from "../versioning/i-cluster-version-graph";
import {IFuture} from "../futures/i-future";
import {ISSHResult} from "../ssh/i-ssh-result";
import {IESXIResponse} from "../esxi/i-esxi-response";
import {IInstallerRestSession} from "../installer/i-installer-rest-session";
import {IESXIServerConfiguration} from "../esxi/configuration/i-esxi-server-configuration";
import {IOpenTSDBRestClient} from "../open-tsdb/i-open-tsdb-rest-client";
import {IElasticsearchRestClient} from "../elasticsearch/i-elasticsearch-rest-client";
import {IMCSRestSession} from "../mcs/i-mcs-rest-session";

export interface ICluster {
    newAuthedMCSSession():IFuture<IMCSRestSession>;
    newAuthedInstallerSession():IFuture<IInstallerRestSession>;
    newOpenTSDBRestClient():IFuture<IOpenTSDBRestClient>;
    newElasticSearchClient():IFuture<IElasticsearchRestClient>;
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
    uploadToEachNode(localPath:string, remotePath:string):IFuture<IList<void>>;
    name:string;
    isHostingService(serviceName:string):boolean;
}