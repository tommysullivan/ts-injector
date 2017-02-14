import {IDocker} from "./i-docker";
import {IClusterTemplate} from "./i-cluster-template";
import {IMarathon} from "../marathon/i-marathon";
import {IUUIDGenerator} from "../uuid/i-uuid-generator";
import {MesosEnvironment} from "./mesos-environment";
import {ICollections} from "../collections/i-collections";
import {ITesting} from "../testing/i-testing";
import {IMesosEnvironmentConfiguration} from "./i-mesos-environment-configuration";
import {IDockerInfrastructureConfiguration} from "./i-docker-infrastructure-config";
import {IMCS} from "../mcs/i-mcs";
import {ITypedJSON} from "../typed-json/i-typed-json";
import {MesosNode} from "./mesos-node";
import {INode} from "../clusters/i-node";
import {IPhase} from "../releasing/i-phase";
import {ClusterRunningInMesos} from "./cluster-running-in-mesos";
import {ICluster} from "../clusters/i-cluster";
import {IList} from "../collections/i-list";
import {IVersioning} from "../versioning/i-versioning";
import {ISSHClient} from "../ssh/i-ssh-client";
import {IInstaller} from "../installer/i-installer";
import {IOpenTSDB} from "../open-tsdb/i-open-tsdb";
import {IElasticsearch} from "../elasticsearch/i-elasticsearch";
import {IOperatingSystems} from "../operating-systems/i-operating-systems";
import {IPackaging} from "../packaging/i-packaging";
import {ClusterTemplate} from "./cluster-template";
import {IFutures} from "../futures/i-futures";
import {IMesosEnvironment} from "./i-mesos-environment";
import {IDockerClusterTemplateConfiguration} from "./i-docker-cluster-template-confiuration";
import {IJSONSerializable} from "../typed-json/i-json-serializable";
import {MesosClusterConfiguration} from "./mesos-cluster-configuration";

export class Docker implements IDocker {

    constructor(
        private dockerInfraConfig:IDockerInfrastructureConfiguration,
        private marathon:IMarathon,
        private uuidGenerator:IUUIDGenerator,
        private collections:ICollections,
        private testing:ITesting,
        private sshClient:ISSHClient,
        private mcs:IMCS,
        private typedJson:ITypedJSON,
        private versioning:IVersioning,
        private installer:IInstaller,
        private openTSDB:IOpenTSDB,
        private elasticSearch:IElasticsearch,
        private operatingSystems:IOperatingSystems,
        private packaging:IPackaging,
        private futures:IFutures
    ) {}

    newClusterTemplateFromConfig(templateId:string):IClusterTemplate {
        return new ClusterTemplate(
            this.uuidGenerator,
            this.futures,
            this.collections,
            this.typedJson,
            this.dockerInfraConfig.dockerRepo,
            this.currentDefaultClusterTemplateConfiguration(templateId)
        );
    }

    currentMesosEnvironmentConfig(envId:string):IMesosEnvironmentConfiguration {
        return this.collections.newList(this.dockerInfraConfig.mesosClusters)
            .firstWhere(n => n.id == envId);
    }

    currentDefaultClusterTemplateConfiguration(templateId:string):IDockerClusterTemplateConfiguration {
        return this.collections.newList(this.dockerInfraConfig.dockerClusterTemplates)
            .firstWhere(n => n.id == templateId);
    }


    newMesosEnvironmentFromConfig(mesosEnvironmentId): IMesosEnvironment {
        return new MesosEnvironment(
            this.collections,
            this,
            this.testing,
            this.sshClient,
            this.mcs,
            this.marathon,
            this.futures,
            this.currentMesosEnvironmentConfig(mesosEnvironmentId)
        );
    }

    newClusterRunningInMesos(clusterFriendlyName:string, environmentId:string, nodes:IList<INode>):ICluster {
        return new ClusterRunningInMesos(
            nodes,
            this.versioning,
            this.futures,
            this,
            clusterFriendlyName,
            environmentId
        );
    }

    newMesosNode(hostIp:string, userName:string, password:string, osName:string, releasePhase:IPhase, serviceNamesExpectedToBeOnNode:IList<string>): INode {
        return new MesosNode(
            hostIp,
            userName,
            password,
            osName,
            this.sshClient,
            this.mcs,
            this.installer,
            this.openTSDB,
            this.elasticSearch,
            this.versioning,
            releasePhase,
            this.operatingSystems,
            this.packaging,
            this.futures,
            serviceNamesExpectedToBeOnNode
        )
    }

    newMesosClusterConfiguration(clusterId:string, maprClusterName:string, nodes:IList<INode>): IJSONSerializable {
        return new MesosClusterConfiguration(
            clusterId,
            maprClusterName,
            nodes
        );
    }
}