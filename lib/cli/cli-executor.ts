import {CucumberCliHelper} from "./cucumber-cli-helper";
import {ClusterCliHelper} from "./cluster-cli-helper";
import {ClusterTesterCliHelper} from "./cluster-tester-cli-helper";
import {ClusterSnapshotCliHelper} from "./cluster-snapshot-cli-helper";
import {ClusterCliGenerator} from "./cluster-generator-cli-helper";
import {ICollections} from "../collections/i-collections";
import {IClusterTestingConfiguration} from "../cluster-testing/i-cluster-testing-configuration";
import {CliHelper} from "./cli-helper";
import {IProcess} from "../node-js-wrappers/i-process";
import {IDockerCliHelper} from "./i-docker-cli-helper";

export class CliExecutor {

    constructor(
        private cucumberCliHelper:CucumberCliHelper,
        private clusterCliHelper:ClusterCliHelper,
        private clusterTesterCliHelper:ClusterTesterCliHelper,
        private clusterSnapshotCliHelper:ClusterSnapshotCliHelper,
        private clusterGeneratorCliHelper:ClusterCliGenerator,
        private collections:ICollections,
        private clusterTestingConfiguration:IClusterTestingConfiguration,
        private cliHelper:CliHelper,
        private process:IProcess,
        private dockerCliHelper:IDockerCliHelper
    ) {}

    executeShowFeatureSets(detail:boolean):void {
        this.cucumberCliHelper.showFeatureSets(detail);
    }

    runExecuteTagsCli():void {
        this.cucumberCliHelper.executeTagsCli();
    }

    runShowClusterIds():void {
        this.clusterCliHelper.showClusterIds();
    }

    runshowNodesHostingService(hostName:string):void {
        this.clusterCliHelper.showNodesHostingService(hostName);
    }

    runShowConfigForCluster(clusterId:string):void {
        this.clusterCliHelper.showConfigForCluster(clusterId);
    }

    runPowerForCluster(action:string, clusterId:string):void {
        this.clusterCliHelper.powerForCluster(action, clusterId);
    }

    runShowVersionsForCluster(clusterId:string):void {
        this.clusterCliHelper.showVersionsForCluster(clusterId);
    }

    runShowHostsForCluster(clusterId:string):void {
        this.clusterCliHelper.showHostsForCluster(clusterId);
    }

    runshowESXIForCluster(clusterId:string):void {
        this.clusterCliHelper.showESXIForCluster(clusterId);
    }

    runFeatureSetId(featureSetId, argv:any):void {
        this.clusterTesterCliHelper.runFeatureSet(featureSetId, argv);
    }

    runCucumberCommand(argv:any):void {
        const cucumberPassThruCommands = this.collections.newList(argv._)
            .everythingAfterIndex(1).map(val => val.toString());

        //TODO: construct cluster object run on docker

        const futureResult = this.clusterTestingConfiguration.clusterIds.length==0
            ? this.cucumberCliHelper.runNonClusterCucumberTest(cucumberPassThruCommands)
            : this.clusterTesterCliHelper.runCucumberOncePerClusterId(cucumberPassThruCommands);

        futureResult.catch(e => {
            this.cliHelper.logError(e);
            this.process.exit(1);
        });
    }
    
    runInstallCommand(secure:boolean){
        this.clusterTesterCliHelper.runCucumberInstallCommand(secure);
    }

    runCommand(argv:any):void {
        this.clusterTesterCliHelper.runCommand(argv);
    }

    runClusterSanpshotStatesCli(clusterId:string):void {
        this.clusterSnapshotCliHelper.clusterSnapshotStatesCli(clusterId);
    }

    runClusterSanpshotInfoCli(clusterId:string):void {
        this.clusterSnapshotCliHelper.clusterSnapshotInfoCli(clusterId);
    }

    runClusterSanpshotApplyCli(clusterId:string, stateName:string):void {
        this.clusterSnapshotCliHelper.clusterSnapshotApplyCli(clusterId, stateName);
    }

    runClusterSanpshotCaptureCli(clusterId:string, snapshotName:string):void {
        this.clusterSnapshotCliHelper.clusterSnapshotCaptureCli(clusterId, snapshotName);
    }

    runClusterSanpshotDeleteCli(clusterId:string, stateName:string):void {
        this.clusterSnapshotCliHelper.clusterSnapshotDeleteCli(clusterId, stateName);
    }
    
    runClusterGenerator():void {
        this.clusterGeneratorCliHelper.generateClusterJson();
    }

    runDockerLauncher(imageName:string): void {
        const futureResult = this.dockerCliHelper.launchDockerImage(imageName).then(result =>
        console.log(`Launched Image ID : ${result}`));
        futureResult.catch(e => {
            this.cliHelper.logError(e);
            this.process.exit(1);
        });
    }

    runKillDockerImage(imageName:string): void {
        const futureResult = this.dockerCliHelper.killDockerImage(imageName).then(result =>
            console.log(`Killed Image : ${result}`));
        futureResult.catch(e => {
            this.cliHelper.logError(e);
            this.process.exit(1);
        });
    }
}