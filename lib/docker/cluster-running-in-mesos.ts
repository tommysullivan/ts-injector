import {IList} from "../collections/i-list";
import {IFuture} from "../futures/i-future";
import {IVersioning} from "../versioning/i-versioning";
import {INode} from "../clusters/i-node";
import {IMCSRestSession} from "../mcs/i-mcs-rest-session";
import {IInstallerRestSession} from "../installer/i-installer-rest-session";
import {IOpenTSDBRestClient} from "../open-tsdb/i-open-tsdb-rest-client";
import {IElasticsearchRestClient} from "../elasticsearch/i-elasticsearch-rest-client";
import {IESXIResponse} from "../esxi/i-esxi-response";
import {ISSHResult} from "../ssh/i-ssh-result";
import {IClusterVersionGraph} from "../versioning/i-cluster-version-graph";
import {IESXIServerConfiguration} from "../esxi/configuration/i-esxi-server-configuration";
import {IClusterRunningInMesos} from "./i-cluster-running-in-mesos";
import {IFutures} from "../futures/i-futures";
import {IDocker} from "./i-docker";

export class ClusterRunningInMesos implements IClusterRunningInMesos {
   constructor(
       private mesosNodes:IList<INode>,
       private versioning:IVersioning,
       private futures:IFutures,
       private docker:IDocker,
       private applicationOrGroupId:string,
       private environmentId:string
   ){}

   get id():string {
       return `${this.mesosEnvironmentId}:${this.marathonApplicationId}`;
   }

    get marathonApplicationId(): string {
        return this.applicationOrGroupId;
    }

    get mesosEnvironmentId(): string {
         return this.environmentId;
    }

    destroy():IFuture<string> {
        return this.docker.newMesosEnvironmentFromConfig(this.mesosEnvironmentId)
            .destroyGroupOrImage(this.marathonApplicationId);
    }

    get isManagedByESXI(): boolean {
        return false;
    }

    get esxiServerConfiguration(): IESXIServerConfiguration{
        throw new Error(`Not supported for Docker images`);
    }

    get name(): string {
        return `${this.applicationOrGroupId}.devops.lab`;
    }

    get nodes(): IList<INode> {
      return this.mesosNodes;
   }

    newAuthedMCSSession(): IFuture<IMCSRestSession> {
        return this.nodeHosting(`mapr-webserver`).newAuthedMCSSession();
    }

    newAuthedInstallerSession(): IFuture<IInstallerRestSession> {
        throw new Error(`Not supported for Docker images`);
    }

    newOpenTSDBRestClient(): IFuture<IOpenTSDBRestClient> {
        return this.futures.newFutureForImmediateValue(this.nodeHosting(`mapr-opentsdb`).newOpenTSDBRestClient());
    }

    newElasticSearchClient(): IFuture<IElasticsearchRestClient> {
        return this.futures.newFutureForImmediateValue(this.nodeHosting(`mapr-elasticsearch`).newElasticSearchClient());
    }

    revertToState(stateName: string): IFuture<IESXIResponse> {
        throw new Error(`Not supported for Docker images Yet !`);
    }

    deleteSnapshotsWithStateName(stateName: string): IFuture<IESXIResponse> {
       throw new Error(`Not supported for Docker images`);
    }

    snapshotInfo(): IFuture<IESXIResponse> {
        throw new Error(`Not supported for Docker images`);
    }

    captureSnapshotNamed(stateName: string): IFuture<IESXIResponse> {
        throw new Error(`Not supported for Docker images`);
    }

    verifyMapRNotInstalled(): IFuture<IList<ISSHResult>> {
        return this.nodes.mapToFutureList(n=>n.verifyMapRNotInstalled())
    }

    powerOff(): IFuture<IESXIResponse> {
        throw new Error(`Not supported for Docker images`);
    }

    nodesHosting(serviceName: string): IList<INode> {
        return this.mesosNodes.filter(n=>n.isHostingService(serviceName));
    }

    nodeHosting(serviceName: string): INode {
        return this.nodesHosting(serviceName).first;
    }

    nodeWithHostName(hostName: string): INode {
        return this.nodes.firstWhere(n=>n.host==hostName);
    }

    executeShellCommandsOnEachNode(...commands): IFuture<IList<IList<ISSHResult>>> {
        return this.mesosNodes.mapToFutureList(n=>n.executeShellCommands(...commands));
    }

    executeShellCommandOnEachNode(command: string): IFuture<IList<ISSHResult>> {
        return this.mesosNodes.mapToFutureList(n=>n.executeShellCommand(command));
    }

    versionGraph(): IFuture<IClusterVersionGraph> {
        return this.mesosNodes.mapToFutureList(n=>n.versionGraph())
            .then(versionGraphs=>{
                return this.versioning.newClusterVersionGraph(
                    this.name,
                    versionGraphs
                );
            });
    }

    uploadToEachNode(localPath: string, remotePath: string): IFuture<IList<ISSHResult>> {
        return this.mesosNodes.mapToFutureList(n=>n.upload(localPath, remotePath));
    }

    isHostingService(serviceName: string): boolean {
        return this.mesosNodes.hasAtLeastOne(n=>n.isHostingService(serviceName));
    }

}