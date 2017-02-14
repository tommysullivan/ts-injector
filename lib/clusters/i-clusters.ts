import {IClusterConfiguration} from "./i-cluster-configuration";
import {IList} from "../collections/i-list";
import {INodeLog} from "./i-node-log";
import {IESXIManagedCluster} from "./i-esxi-managed-cluster";
import {IClusterLogCapturer} from "./i-cluster-log-capturer";
import {INode} from "./i-node";
import {INodeConfiguration} from "../nodes/i-node-configuration";
import {ICluster} from "./i-cluster";
import {IPhase} from "../releasing/i-phase";
import {IClusterInstaller} from "../installer/i-cluster-installer";
import {IMCSDashboardInfo} from "../mcs/i-mcs-dashboard-info";
import {IMCSNodeInfo} from "../mcs/i-mcs-node-info";
import {IClusterLoaderForMesosEnvironment} from "./i-mesos-cluster-loader";

export interface IClusters {
    clusterForId(clusterId:string):ICluster;
    newCluster(clusterConfiguration:IClusterConfiguration, releasePhase:IPhase):ICluster;
    esxiManagedClusterForId(clusterId:string):IESXIManagedCluster;
    newNode(nodeConfiguration:INodeConfiguration, releasePhase:IPhase):INode;
    newClusterLogCapturer():IClusterLogCapturer;
    newESXIManagedCluster(clusterConfiguration:IClusterConfiguration):IESXIManagedCluster;
    newNodeLog(nodeHost:string, logContent:Array<string>, logTitle:string):INodeLog;
    clusterConfigurationWithId(id:string):IClusterConfiguration;
    allIds:IList<string>;
    allConfigurations:IList<IClusterConfiguration>;
    newClusterInstaller():IClusterInstaller;
}