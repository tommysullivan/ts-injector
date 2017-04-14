import {IFuture} from "../futures/i-future";
import {IDictionary} from "../collections/i-dictionary";
import {IList} from "../collections/i-list";
import {IJSONObject} from "../typed-json/i-json-object";
import {INodeTemplateConfig} from "./i-node-template-config";
import {IUUIDGenerator} from "../uuid/i-uuid-generator";
import {IFutures} from "../futures/i-futures";
import {ICollections} from "../collections/i-collections";
import {IClusterTemplate} from "./i-cluster-template";
import {IDockerClusterTemplateConfiguration} from "./i-docker-cluster-template-confiuration";
import {IClusterRunningInMesos} from "./i-cluster-running-in-mesos";
import {IMesosEnvironment} from "./i-mesos-environment";
import {ITypedJSON} from "../typed-json/i-typed-json";

export class ClusterTemplate implements IClusterTemplate {
    constructor(
        private uuidGenerator:IUUIDGenerator,
        private futures:IFutures,
        private collections:ICollections,
        private typedJson:ITypedJSON,
        private dockerRepo:string,
        private dockerClusterTemplateConfiguration:IDockerClusterTemplateConfiguration
    ) {}

    private generatedCusterId;

    provision(targetEnvironment: IMesosEnvironment): IFuture<IClusterRunningInMesos> {

        const instancesSum = this.collections.newList(this.dockerClusterTemplateConfiguration.nodeTemplates).map(template => template.instances).sum;

        const futureApplicationId = instancesSum == 1
            ? this.launchSingleNodeImage(targetEnvironment)
            : this.launchMultiNodeImages(targetEnvironment);

        return futureApplicationId
            .then(marathonApplicationId => {
                return targetEnvironment.taskStateWithTimeout(marathonApplicationId.substr(1, marathonApplicationId.length), 10000, 5);
            })
            .then(marathonApplicationId => targetEnvironment.loadCluster(marathonApplicationId));
    }

    private launchSingleNodeImage(targetEnvironment:IMesosEnvironment):IFuture<string> {
        const envVariables = <IDictionary<string>>this.collections.newEmptyDictionary();
        const clusterName = this.generateClusterName;
        envVariables.add(`clusterName`, clusterName);
        envVariables.add(`generatedApplicationName`, this.generateApplicationName(this.dockerClusterTemplateConfiguration.id));
        return this.dockerNodeTemplatesAsList.first.diskProvider
            ? this.createDiskFile(clusterName, targetEnvironment).then(filePath => {
                envVariables.add(`diskList`, `/dockerdisks/${filePath}`);
                return targetEnvironment.getMarathonRestClient()
                    .createApplicationAndGetID(this.generateJsonToLaunchDocker(this.dockerNodeTemplatesAsList.first, envVariables, targetEnvironment))
            })
            : targetEnvironment.getMarathonRestClient()
            .createApplicationAndGetID(this.generateJsonToLaunchDocker(this.dockerNodeTemplatesAsList.first, envVariables, targetEnvironment));
    }

    private launchMultiNodeImages(targetEnvironment: IMesosEnvironment): IFuture<string> {
        const clusterName = this.generateClusterName;
        const groupName = this.generateGroupName(this.dockerClusterTemplateConfiguration.id);
        if (this.dockerNodeTemplatesAsList.filter(img => img.type != null).length > 0) {
            const subGroup = this.dataGroupName(this.dockerClusterTemplateConfiguration.id);
            return targetEnvironment.getMarathonRestClient().createEmptyGroup(groupName)
                .then(_ => targetEnvironment.getMarathonRestClient().createEmptyGroup(`${groupName}/${subGroup}`))
                .then(_ => {
                    return this.dockerNodeTemplatesAsList.filter(img => img.type == `control`)
                        .flatMapToFutureList((controlNodeTemplate, index) =>
                            this.getListOfApplicationJsonPerInstance(controlNodeTemplate, clusterName, this.collections.newEmptyList<string>(), targetEnvironment, index))
                })
                .then(listOfJson => targetEnvironment.getMarathonRestClient().createApplicationsInGroup(groupName, listOfJson))
                .then(applicationIds => this.futures.newDelayedFuture(20000, applicationIds))
                .then(applicationIds => targetEnvironment.getMarathonRestClient().getAllApplicationIPsInGroup(groupName))
                .then(allIP => {
                    console.log(`IP list : ${allIP.join(`,`)}`);
                    return this.dockerNodeTemplatesAsList.filter(img => img.type == `data`)
                        .flatMapToFutureList((dataNodeTemplate, index) =>
                            this.getListOfApplicationJsonPerInstance(dataNodeTemplate, clusterName, allIP, targetEnvironment, index))
                })
                .then(jsonAppList => targetEnvironment.getMarathonRestClient().createApplicationsInGroup(`${groupName}/${subGroup}`, jsonAppList))
                .then(appIdList => groupName);
        }
        else {
            return targetEnvironment.getMarathonRestClient().createEmptyGroup(groupName)
                .then(_ => this.dockerNodeTemplatesAsList
                    .flatMapToFutureList((nodeTemplate, index) => this.getListOfApplicationJsonPerInstance(nodeTemplate, clusterName, this.collections.newEmptyList<string>(), targetEnvironment, index)))
                .then(appDataJsonList => targetEnvironment.getMarathonRestClient().createApplicationsInGroup(groupName, appDataJsonList))
                .then(_ => groupName);
        }
    }

    // TODO : get rid of mutation
    get uniqueClusterId(): string {
        if (this.generatedCusterId) {
            return this.generatedCusterId;
        }
        else {
            this.generatedCusterId = `${this.uuidGenerator.v4()}`;
            return this.generatedCusterId;
        }
    }

    get generateClusterName():string {
        return `${this.uniqueClusterId}.devops.lab`;
    }

    private generateGroupName(templateId:string):string {
        return `${templateId.toLowerCase()}.${this.uniqueClusterId}.group`;
    }

    private dataGroupName(templateId:string):string {
        return `${templateId.toLowerCase()}.${this.uniqueClusterId}.group2`;
    }

    private generateApplicationName(templateId:string):string {
        return `${templateId.toLowerCase()}.${this.uniqueClusterId}`;
    }

    private getListOfApplicationJsonPerInstance(nodeTemplate:INodeTemplateConfig, clusterName:string, ipList:IList<string>, targetEnvironment:IMesosEnvironment, appNumber:number):IFuture<IList<IJSONObject>> {
        return this.collections.newListOfSize(nodeTemplate.instances).mapToFutureList((_, index) => {
            const envVariables = <IDictionary<string>>this.collections.newEmptyDictionary();
            envVariables.add(`generatedApplicationName`, `${this.generateApplicationName(this.dockerClusterTemplateConfiguration.id)}.a${appNumber}.app${index}`);
            envVariables.add(`clusterName`, clusterName);
            envVariables.add(`memTotal`, `16000000`);
            envVariables.add(`cldbIPs`, ipList.join(`,`));
            return nodeTemplate.diskProvider
                ? this.createDiskFile(clusterName, targetEnvironment)
                .then(filePath => {
                    envVariables.add(`diskList`, `${targetEnvironment.dockerVolumeLocalPath}/${filePath}`);
                    return this.generateJsonToLaunchDocker(nodeTemplate, envVariables, targetEnvironment);
                })
                : this.futures.newFutureForImmediateValue(this.generateJsonToLaunchDocker(nodeTemplate, envVariables, targetEnvironment));
        });
    }

    createDiskFile(clusterName:string, targetEnvironment:IMesosEnvironment):IFuture<string> {
        const dirCreateCommand = `mkdir -p`;
        const fullDirPath = this.mountFullMountPath(clusterName, targetEnvironment);
        const fileName = this.uniqueClusterId;
        const createEmptyDiskFile = `dd if=/dev/zero of=${fullDirPath}/${fileName} count=0 seek=20 bs=1024M`;
        return targetEnvironment.getDockerSSHSession()
            .then(client => client.executeCommands(`${dirCreateCommand} ${fullDirPath}`, `${createEmptyDiskFile}`))
            .then(result => fileName);
    }

    mountFullMountPath(clusterNameToGenerateMountPath:string, targetEnvironment:IMesosEnvironment): string {
        return `${targetEnvironment.dockerVolumeMountPath}/${clusterNameToGenerateMountPath}`;
    }

    get dockerNodeTemplatesAsList():IList<INodeTemplateConfig> {
        return this.collections.newList(this.dockerClusterTemplateConfiguration.nodeTemplates);
    }

    private templateConstraints(nodeTemplate: INodeTemplateConfig): string[] | string[][] {
        if (nodeTemplate.constraints.length > 0)
            return this.collections.newList(nodeTemplate.constraints).map(condition => condition.split(` `)).toArray();
        else
            return this.dockerClusterTemplateConfiguration.defaultConstraints.length > 0
                ? this.collections.newList(this.dockerClusterTemplateConfiguration.defaultConstraints).map(condition => condition.split(` `)).toArray()
                : []
    }

    generateJsonToLaunchDocker(nodeTemplate: INodeTemplateConfig, envVariables: IDictionary<string>, targetEnvironment:IMesosEnvironment): IJSONObject {
        const jsonMarathonRequest = {
            id: envVariables.get(`generatedApplicationName`),
            container: {
                type: "DOCKER",
                volumes: [
                    {
                        hostPath: this.mountFullMountPath(envVariables.get(`clusterName`), targetEnvironment),
                        containerPath: targetEnvironment.dockerVolumeLocalPath,
                        mode: "RW"
                    }
                ],
                docker: {
                    image: `${this.dockerRepo}/${nodeTemplate.dockerImageName}`,
                    network: "BRIDGE",
                    portMappings: null,
                    privileged: true,
                    forcePullImage: false
                }
            },
            cpus: this.dockerClusterTemplateConfiguration.defaultCPUsPerContainer,
            mem: this.dockerClusterTemplateConfiguration.defaultMemoryPerContainer,
            instances: 1,
            maxLaunchDelaySeconds: 3600,
            env: {
                CLDBIP: envVariables.get(`cldbIPs`),
                CLUSTERNAME: envVariables.get(`clusterName`),
                DISKLIST: envVariables.get(`diskList`),
                MEMTOTAL: envVariables.get(`memTotal`)
            },
            labels: this.templateServiceListAsJson(nodeTemplate).toJSON(),
            constraints: this.templateConstraints(nodeTemplate)

        };
        return this.typedJson.newJSONObject(jsonMarathonRequest);
    }

    private templateServiceListAsJson(dockerImage: INodeTemplateConfig): IJSONObject {
        const listOfServiceString = this.collections.newList(dockerImage.serviceNames).map(serviceName => `"${serviceName}": "true"`);
        console.log(`{${listOfServiceString.join(`,`)}}`);
        return this.typedJson.newJSONObject(JSON.parse(`{${listOfServiceString.join(`,`)}}`));
    }

}