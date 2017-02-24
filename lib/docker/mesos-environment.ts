import {IFuture} from "../futures/i-future";
import {ICollections} from "../collections/i-collections";
import {IMCS} from "../mcs/i-mcs";
import {ITesting} from "../testing/i-testing";
import {ISSHClient} from "../ssh/i-ssh-client";
import {IDocker} from "./i-docker";
import {IClusterRunningInMesos} from "./i-cluster-running-in-mesos";
import {IMarathon} from "../marathon/i-marathon";
import {IMesosEnvironment} from "./i-mesos-environment";
import {IMarathonRestClient} from "../marathon/i-marathon-rest-client";
import {ISSHSession} from "../ssh/i-ssh-session";
import {IMesosEnvironmentConfiguration} from "./i-mesos-environment-configuration";
import {IFutures} from "../futures/i-futures";
import {IList} from "../collections/i-list";
import {IJSONObject} from "../typed-json/i-json-object";

export class MesosEnvironment implements IMesosEnvironment {
    constructor(
        private collections:ICollections,
        private docker:IDocker,
        private testing:ITesting,
        private sshClient:ISSHClient,
        private mcs:IMCS,
        private marathon:IMarathon,
        private futures:IFutures,
        private mesosEnvironmentConfiguration:IMesosEnvironmentConfiguration
    ) {}


    loadCluster(marathonApplicationId: string): IFuture<IClusterRunningInMesos> {
        return marathonApplicationId.indexOf(`group`) > -1
            ? this.loadMultiNode(marathonApplicationId)
            : this.loadSingleNode(marathonApplicationId);
    }

    private loadMultiNode(marathonApplicationId: string): IFuture<IClusterRunningInMesos> {
        return this.marathonRestClient.getAllApplicationIdsInGroup(marathonApplicationId)
            .then(applicationIds => applicationIds.mapToFutureList(applicationId => this.marathonRestClient.getResult(applicationId))
            .then(results => results.mapToFutureList(result => this.osName(result.ipAddressOfLaunchedImage).then(osName =>
                this.docker.newMesosNode(
                    result.ipAddressOfLaunchedImage,
                    this.mesosEnvironmentConfiguration.dockerImagesUserName,
                    this.mesosEnvironmentConfiguration.dockerImagesPassword,
                    osName,
                    this.testing.defaultReleasePhase,
                    this.jsonObjectServiceList(result.labels)
                ))
            )))
            .then(nodes => this.docker.newClusterRunningInMesos(
                marathonApplicationId,
                this.environmentId,
                nodes
            ));
    }

    get marathonRestClient():IMarathonRestClient {
        return this.marathon.newMarathonRestClient(this.mesosEnvironmentConfiguration.marathonIP, this.mesosEnvironmentConfiguration.marathonPort);
    }

    private loadSingleNode(marathonApplicationId: string): IFuture<IClusterRunningInMesos> {
        return this.marathonRestClient.getResult(marathonApplicationId)
            .then(result => this.osName(result.ipAddressOfLaunchedImage)
                .then(osName => this.docker.newClusterRunningInMesos(
                    marathonApplicationId,
                    this.environmentId,
                    this.collections.newList([this.docker.newMesosNode(
                        result.ipAddressOfLaunchedImage,
                        this.mesosEnvironmentConfiguration.dockerImagesUserName,
                        this.mesosEnvironmentConfiguration.dockerImagesPassword,
                        osName,
                        this.testing.defaultReleasePhase,
                        this.jsonObjectServiceList(result.labels)
                    )])
                ))
            );
    }

    private osName(ipAddress:string):IFuture<string> {
        return this.sshClient.connect(ipAddress, this.mesosEnvironmentConfiguration.dockerImagesUserName, this.mesosEnvironmentConfiguration.dockerImagesPassword)
            .then(sshSession => sshSession.executeCommand(`cat /etc/issue`))
            .then(sshResult => {
                if (sshResult.processResult.stdoutLines.join(``).indexOf(`CentOS`) > -1)
                    return `CentOS`;
                else if (sshResult.processResult.stdoutLines.join(``).indexOf(`Ubuntu`) > -1)
                    return `Ubuntu`;
                else
                    return `SuSE`;
            });
    }

    getMarathonRestClient(): IMarathonRestClient {
        return this.marathon.newMarathonRestClient(this.mesosEnvironmentConfiguration.marathonIP, this.mesosEnvironmentConfiguration.marathonPort);
    }


    getDockerSSHSession(): IFuture<ISSHSession> {
        //TODO: Make this round robin or random
        return this.sshClient.connect(this.mesosEnvironmentConfiguration.marathonIP, this.mesosEnvironmentConfiguration.marathonUser, this.mesosEnvironmentConfiguration.marathonPassword);
    }


    get dockerVolumeLocalPath():string {
        return this.mesosEnvironmentConfiguration.dockerVolumeLocalPath;
    }


    get dockerVolumeMountPath():string {
        return this.mesosEnvironmentConfiguration.dockerVolumeMountPath;
    }


    taskStateWithTimeout(marathonApplicationId: string, timeOut:number, retryAttempts:number):IFuture<string> {
        const marathonRestClient = this.marathon.newMarathonRestClient(this.mesosEnvironmentConfiguration.marathonIP, this.mesosEnvironmentConfiguration.marathonPort);
        return marathonRestClient.getTaskStatus(marathonApplicationId).then(state =>{
            console.log(`state : ${state}`);
            if(retryAttempts == 0)
                throw new Error(`Image not in Running after all attempts`);
            else if (!(state == `TASK_RUNNING`))
                return this.futures.newDelayedFuture(timeOut).then(_ => this.taskStateWithTimeout(marathonApplicationId, timeOut, retryAttempts-1));
            else
                return marathonApplicationId;
        })
    }

    get environmentId():string {
        return this.mesosEnvironmentConfiguration.id;
    }

    private jsonObjectServiceList(serviceJson:IJSONObject):IList<string> {
        const data = Object.keys(JSON.parse(serviceJson.toString()));
        console.log(data);
        return this.collections.newList(data);
    }

    destroyGroupOrImage(imageIDOnMarathon:string):IFuture<string> {
        return this.marathonRestClient
            .killApplication(imageIDOnMarathon)
            .then(result => `Application killed: ${result.id}`)
            .catch(e =>{
                console.log(`No application present. Trying to clear group`);
                return this.marathonRestClient.clearGroup(imageIDOnMarathon);
            });
    }

}