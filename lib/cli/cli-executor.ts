import {CucumberCliHelper} from "./cucumber-cli-helper";
import {ClusterCliHelper} from "./cluster-cli-helper";
import {ClusterTesterCliHelper} from "./cluster-tester-cli-helper";
import {ClusterSnapshotCliHelper} from "./cluster-snapshot-cli-helper";
import {ClusterCliGenerator} from "./cluster-generator-cli-helper";

export class CliExecutor {

    constructor(
        private cucumberCliHelper:CucumberCliHelper,
        private clusterCliHelper:ClusterCliHelper,
        private clusterTesterCliHelper:ClusterTesterCliHelper,
        private clusterSnapshotCliHelper:ClusterSnapshotCliHelper,
        private clusterGeneratorCliHelper:ClusterCliGenerator
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

    runCucucmberComamnd(argv:any):void {
        this.clusterTesterCliHelper.runCucumberCommand(argv);
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

}