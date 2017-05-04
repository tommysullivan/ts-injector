import {IClusterTemplate} from "./i-cluster-template";
import {IPhase} from "../releasing/i-phase";
import {INode} from "../clusters/i-node";
import {IList} from "../collections/i-list";
import {ICluster} from "../clusters/i-cluster";
import {IMesosEnvironment} from "./i-mesos-environment";
import {IJSONSerializable} from "../typed-json/i-json-serializable";

export interface IDocker {
    newClusterTemplateFromConfig(templateId:string):IClusterTemplate;
    newMesosEnvironmentFromConfig(mesosEnvironmentId):IMesosEnvironment;
    newMesosNode(hostIp:string, username:string, password:string, osName:string,releasePhase:IPhase, serviceNames:IList<string>):INode;
    newClusterRunningInMesos(friendlyName:string, environmentId:string, nodes:IList<INode>):ICluster;
    newMesosClusterConfiguration(clusterId:string, maprClusterName:string, nodes:IList<INode>): IJSONSerializable;
    allTemplates(): IList<string>;
    allEnvironments(): IList<string>;
}