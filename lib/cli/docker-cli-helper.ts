import {IDockerCliHelper} from "./i-docker-cli-helper";
import {IFuture} from "../futures/i-future";
import {IDocker} from "../docker/i-docker";
import {IProcess} from "../node-js-wrappers/i-process";
import {IConsole} from "../console/i-console";
import {CliHelper} from "./cli-helper";

export class DockerCliHelper implements IDockerCliHelper {

    constructor(
        private docker:IDocker,
        private process:IProcess,
        private console:IConsole,
        private cliHelper:CliHelper
    ) {}

    provisionCluster(clusterTemplateId:string, mesosEnvironmentId:string):IFuture<any> {
        this.console.info(`Provisioning cluster...`);
        if (!this.docker.allEnvironments().contain(mesosEnvironmentId))
            throw new Error(`Mesos Environment not found. Please run devops docker environmentIds`);
        if (!this.docker.allTemplates().contain(clusterTemplateId))
            throw new Error(`Docker template  not found. Please run devops docker templatesIds`);
        const targetMesosEnvironment = this.docker.newMesosEnvironmentFromConfig(mesosEnvironmentId);
        return this.docker.newClusterTemplateFromConfig(clusterTemplateId).provision(targetMesosEnvironment)
            .then(cluster => this.console.info(`Provisioning complete. When finished, please destroy cluster via "devops docker kill -c ${cluster.id}`))
            .catch(e => {
                this.cliHelper.logError(e);
                this.process.exit(1);
            });
    }

    destroyCluster(clusterId:string):IFuture<any> {
        const [mesosEnvironmentId, marathonApplicationId] = clusterId.split(':');
        return this.docker.newMesosEnvironmentFromConfig(mesosEnvironmentId)
            .loadCluster(marathonApplicationId)
            .then(cluster => cluster.destroy())
            .catch(e => {
                this.cliHelper.logError(e);
                this.process.exit(1);
            });
    }

    destroyAllApplications(mesosEnvironmentId:string):IFuture<any> {
        return this.docker.newMesosEnvironmentFromConfig(mesosEnvironmentId).killAllApps();
    }

    listAllClusterTemplates(): void {
        console.log(`TemplateIDs : ${this.docker.allTemplates().sort()}`);
    }

    listAllEnvironments(): void {
        console.log(`TemplateIDs : ${this.docker.allEnvironments().sort()}`);
    }
}