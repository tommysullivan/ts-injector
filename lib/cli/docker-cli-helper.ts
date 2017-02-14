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
        const targetMesosEnvironment = this.docker.newMesosEnvironmentFromConfig(mesosEnvironmentId);
        return this.docker.newClusterTemplateFromConfig(clusterTemplateId).provision(targetMesosEnvironment)
            .then(cluster => this.console.info(`Provisioning complete. When finished, please destroy cluster via "devops docker kill ${cluster.id}`))
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
}