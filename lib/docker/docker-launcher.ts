import {IDockerLauncher} from "./i-docker-launcher";
import {IJSONObject} from "../typed-json/i-json-object";
import {IClusterTestingConfiguration} from "../cluster-testing/i-cluster-testing-configuration";
import {IDockerClusterConfiguration} from "./i-docker-cluster-config";
import {ITypedJSON} from "../typed-json/i-typed-json";
import {ICollections} from "../collections/i-collections";
import {IDockerInfrastructureConfiguration} from "./i-docker-infrastructure-config";
import {IMarathon} from "../marathon/i-marathon";
import {IMesosClusterConfiguration} from "./i-mesos-cluster-config";
import {IMarathonRestClient} from "../marathon/i-marathon-rest-client";
import {IDockerImageNameConfig} from "./i-docker-image-name-config";
import {IList} from "../collections/i-list";
import {IDictionary} from "../collections/i-dictionary";
import {IUUIDGenerator} from "../uuid/i-uuid-generator";
import {IFutures} from "../futures/i-futures";
import {IFuture} from "../futures/i-future";

export class DockerLauncher implements IDockerLauncher {

    private marathonRestClient:IMarathonRestClient;
    private cldbIPs:IList<string>;
    private clusterName:string;
    private allDockerImageNames:IList<string>;
    private dockerId:string;

    constructor(
        private dockerInfraConfig:IDockerInfrastructureConfiguration,
        private clusterTestingConfig:IClusterTestingConfiguration,
        private typedJson:ITypedJSON,
        private collections:ICollections,
        private marathon:IMarathon,
        private uuidGenerator:IUUIDGenerator,
        private futures:IFutures
    ){}

    launch(givenDockerId:string): IFuture<string> {
        this.dockerId = givenDockerId;
        this.marathonRestClient = this.marathon.newMarathonRestClient(this.currentDockerFarm.marathonIP, this.currentDockerFarm.marathonPort);
        return this.currentDockerCluster.nodes == 1 || this.currentDockerCluster.nodes == null
            ? this.launchSingleNodeImage()
            : this.launchMultiNodeImages();
    }

    launchSingleNodeImage(): IFuture<string> {
        const envVariables = <IDictionary<string>>this.collections.newEmptyDictionary();
        const clusterId = this.generateClusterId;
        envVariables.add(`clusterName`, clusterId);
        envVariables.add(`generatedDockerName`, this.generateDockerName(this.currentDockerCluster.id));
        return this.currentDockerImageNames.first.diskProvider
            ? this.createDiskFile(clusterId).then(filePath => {
                envVariables.add(`diskList`, `/dockerdisks/${filePath}`);
                    return this.marathonRestClient.createApplicationAndGetID(this.generateJsonToLaunchDocker(this.currentDockerImageNames.first, envVariables))
                })
            : this.marathonRestClient.createApplicationAndGetID(this.generateJsonToLaunchDocker(this.currentDockerImageNames.first, envVariables));
    }

    launchMultiNodeImages():IFuture<string> {
        const clusterName = this.generateClusterId;
        this.allDockerImageNames = <IList<string>>this.collections.newEmptyList();
        const groupName =  this.generateGroupName;
        const subGroup = this.dataGroupName;
        return this.marathonRestClient.createEmptyGroup(groupName)
            .then(_ => this.marathonRestClient.createEmptyGroup(`${groupName}/${subGroup}`))
            .then(_ => {
                const firstControl = this.currentDockerImageNames.filter(img => img.type == `control`).first;
                return this.getListOfApplicationJson(firstControl, clusterName, this.collections.newEmptyList<string>());
            })
            .then(listOfJson => this.marathonRestClient.createApplicationWithGroup(groupName, listOfJson))
            .then(applicationIds => this.futures.newDelayedFuture(20000, applicationIds))
            .then(applicationIds => this.marathonRestClient.getAllApplicationIPsInGroup(groupName))
            .then(allIP => {
                console.log(`IP list : ${allIP.join(`,`)}`);
                const dataImage = this.currentDockerImageNames.filter(img => img.type == `data`).first;
                return this.getListOfApplicationJson(dataImage, clusterName, allIP);
            })
            .then(jsonAppList => this.marathonRestClient.createApplicationWithGroup(`${groupName}/${subGroup}`, jsonAppList))
            .then(appIdList => groupName);
    }

    getListOfApplicationJson(image:IDockerImageNameConfig, clusterName:string, ipList:IList<string>):IFuture<IList<IJSONObject>> {
        return this.collections.newListOfSize(image.instances).mapToFutureList(_ => {
            const envVariables = <IDictionary<string>>this.collections.newEmptyDictionary();
            envVariables.add(`generatedDockerName`, this.generateDockerName(this.currentDockerCluster.id));
            envVariables.add(`clusterName`, clusterName);
            envVariables.add(`memTotal`, `16000000`);
            envVariables.add(`cldbIPs`, ipList.join(`,`));
            return this.createDiskFile(clusterName)
                .then(filePath => {
                envVariables.add(`diskList`, `${this.currentDockerFarm.dockerVolumeLocalPath}/${filePath}`);
                return this.generateJsonToLaunchDocker(image, envVariables);
            })
        });
    }

    createDiskFile(clusterName:string):IFuture<string> {
        const dirCreateCommand = `mkdir -p`;
        const fullDirPath = this.mountFullMountPath(clusterName);
        const fileName = this.uuidGenerator.v4();
        const createEmptyDiskFile = `dd if=/dev/zero of=${fullDirPath}/${fileName} count=0 seek=20 bs=1024M`;
        return this.marathon.newMarathonSSHClient(this.currentDockerFarm.marathonIP, this.currentDockerFarm.marathonUser, this.currentDockerFarm.marathonPassword)
            .then(client => client.executeCommands(`${dirCreateCommand} ${fullDirPath}`, `${createEmptyDiskFile}`))
            .then(result => fileName);
    }

    private mountFullMountPath(clusterNameToGenerateMountPath:string): string {
        return `${this.currentDockerFarm.dockerVolumeMountPath}/${clusterNameToGenerateMountPath}`;
    }

    get currentDockerFarm(): IMesosClusterConfiguration {
        return this.collections.newList(this.dockerInfraConfig.mesosClusters)
            .filter(n => n.id == this.clusterTestingConfig.defaultMesosClusterId).first
    }

    get currentDockerCluster(): IDockerClusterConfiguration {
            return this.dockerId
                ? this.collections.newList(this.dockerInfraConfig.dockerClusters)
                    .filter(n => n.id == this.dockerId).first
                : this.collections.newList(this.dockerInfraConfig.dockerClusters)
                    .filter(n => n.id == this.clusterTestingConfig.defaultDockerId).first
    }

    get currentDockerImageNames():IList<IDockerImageNameConfig> {
        return this.collections.newList(this.currentDockerCluster.imageNames);
    }

    get generateClusterId():string {
        return `${this.uuidGenerator.v4()}_cluster`;
    }

    get generateGroupName():string {
        return `group-${this.uuidGenerator.v4()}`;
    }

    get dataGroupName():string {
        return `datagroup-${this.uuidGenerator.v4()}`;
    }

    generateDockerName(imageId:string):string {
        return `${imageId}.${this.uuidGenerator.v4()}`;
    }

    generateJsonToLaunchDocker(dockerImage: IDockerImageNameConfig, envVariables: IDictionary<string>): IJSONObject {
        const jsonMarathonRequest = {
            id: envVariables.get(`generatedDockerName`).toLowerCase(),
            container: {
                type: "DOCKER",
                volumes: [
                    {
                        hostPath: this.mountFullMountPath(envVariables.get(`clusterName`)),
                        containerPath: this.currentDockerFarm.dockerVolumeLocalPath,
                        mode: "RW"
                    }
                ],
                docker: {
                    image: `${this.dockerInfraConfig.dockerRepo}/${dockerImage.name}`,
                    network: "BRIDGE",
                    portMappings: null,
                    privileged: true,
                    forcePullImage: false
                }
            },
            cpus: this.currentDockerCluster.defaultCPUsPerContainer,
            mem: this.currentDockerCluster.defaultMemoryPerContainer,
            instances: dockerImage.instances,
            maxLaunchDelaySeconds: 3600,
            env: {
                CLDBIP: envVariables.get(`cldbIPs`),
                CLUSTERNAME: envVariables.get(`clusterName`),
                DISKLIST: envVariables.get(`diskList`),
                MEMTOTAL: envVariables.get(`memTotal`)
            }
        };
        return this.typedJson.newJSONObject(jsonMarathonRequest);
    }

    getIPForImage(applicationId: string): string {
        return null;
    }

    killStartedImages(imageIDOnMarathon:string): IFuture<string> {
        const marathonDelRestClient = this.marathon.newMarathonRestClient(this.currentDockerFarm.marathonIP, this.currentDockerFarm.marathonPort);
        return marathonDelRestClient.killApplication(imageIDOnMarathon).catch(e =>{
            console.log(`No application present. Trying to clear group`);
            return marathonDelRestClient.clearGroup(imageIDOnMarathon);
        });
    }
}