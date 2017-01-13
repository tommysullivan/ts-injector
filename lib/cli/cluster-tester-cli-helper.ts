import {IProcess} from "../node-js-wrappers/i-process";
import {IConsole} from "../console/i-console";
import {ICucumber} from "../cucumber/i-cucumber";
import {IList} from "../collections/i-list";
import {ICollections} from "../collections/i-collections";
import {ICluster} from "../clusters/i-cluster";
import {INode} from "../clusters/i-node";
import {IMultiClusterTester} from "../cluster-testing/i-multi-cluster-tester";
import {IClusters} from "../clusters/i-clusters";
import {IFuture} from "../futures/i-future";
import {ITesting} from "../testing/i-testing";

export class ClusterTesterCliHelper {

    constructor(
        private process:IProcess,
        private console:IConsole,
        private cucumber:ICucumber,
        private clusterIds:() => IList<string>,
        private clusters:IClusters,
        private collections:ICollections,
        private multiClusterTester:IMultiClusterTester,
        private testing:ITesting
    ) {}

    runFeatureSet(featureSetId:string, argv:any){
        const featureSet = this.cucumber.featureSets.setWithId(featureSetId);
        const cucumberPassThruCommands = featureSet.featureFilesInExecutionOrder.append(
            this.collections.newList(argv._)
                .everythingAfterIndex(1).map(val => val.toString())
        );
        this.runCucumberOncePerClusterId(cucumberPassThruCommands);
    }
    
    runCucumberInstallCommand(secure:boolean):void {
        if(secure)
            this.runCucumberOncePerClusterId(this.collections.newList(["--tags", "@packageInstallationSecure"]));
        else
            this.runCucumberOncePerClusterId(this.collections.newList(["--tags", "@packageInstallation"]));
    }

    runCommand(argv:any):void {
        const command = this.collections.newList(argv._)
            .everythingAfterIndex(1).map(val => val.toString()).join(' ');
        const clusters = this.clusterIds().map(
            clusterId=>this.clusters.newCluster(this.clusters.clusterConfigurationWithId(clusterId), this.testing.defaultReleasePhase)
        );
        const restrictNodesBasedOnServices = this.process.environmentVariables.hasKey('nodesWith');
        if(clusters.isEmpty) this.console.warn(
            'No cluster id(s) set. Please set ENV clusterId or clusterIds',
            'Valid IDS:',
            this.clusters.allIds.toString()
        );
        clusters.forEach(cluster=>{
            const nodesForShellCommand = restrictNodesBasedOnServices
                ? this.nodesRunningRequestedServices(cluster)
                : cluster.nodes;

            nodesForShellCommand
                .mapToFutureList(n=>n.executeShellCommand(command))
                .then(result=>{
                    this.console.log('*****************************************');
                    this.console.log(`Cluster Result for id "${cluster.name}`);
                    this.console.log("\n");
                    this.console.log(result.toString());
                });
        });
    }

    public runCucumberOncePerClusterId(cucumberPassThruCommands:IList<string>):IFuture<any> {
        return this.multiClusterTester.runCucumberForEachClusterAndSaveResultsToPortalIfApplicable(cucumberPassThruCommands)
            .then(clusterTestResults => {
                const allPassed = clusterTestResults.all(t=>t.passed);
                if(clusterTestResults.length > 1) {
                    this.console.log(`Multi Cluster Test of ${clusterTestResults.length} clusters ${allPassed ? 'Passed' : 'Failed'}`);
                    clusterTestResults.forEach(result=>{
                        this.console.log(`Cluster ${result.clusterId}: ${result.passed ? 'passed' : 'failed'}`);
                    })
                }
                this.process.exit(allPassed ? 0 : 1);
            });
    }

    private nodesRunningRequestedServices(cluster:ICluster):IList<INode> {
        const requisiteServiceNames = this.collections.newList<string>(this.process.environmentVariableNamed('nodesWith').split(','));
        return cluster.nodes.where(n=>n.serviceNames.containAll(requisiteServiceNames));
    }

}