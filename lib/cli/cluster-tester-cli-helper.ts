import IProcess from "../node-js-wrappers/i-process";
import IConsole from "../node-js-wrappers/i-console";
import ICucumber from "../cucumber/i-cucumber";
import ClusterTestingConfiguration from "../cluster-testing/cluster-testing-configuration";
import IList from "../collections/i-list";
import ClusterTesting from "../cluster-testing/cluster-testing";
import Clusters from "../clusters/clusters";
import IPromiseFactory from "../promise/i-promise-factory";
import ICollections from "../collections/i-collections";
import IClusterUnderTest from "../cluster-testing/i-cluster-under-test";
import INodeUnderTest from "../cluster-testing/i-node-under-test";
import MultiClusterTester from "../cluster-testing/multi-cluster-tester";
import CliHelper from "./cli-helper";

export default class ClusterTesterCliHelper {

    constructor(
        private process:IProcess,
        private console:IConsole,
        private cucumber:ICucumber,
        private clusterTestingConfiguration:ClusterTestingConfiguration,
        private clusterTesting:ClusterTesting,
        private clusters:Clusters,
        private promiseFactory:IPromiseFactory,
        private collections:ICollections,
        private multiClusterTester:MultiClusterTester,
        private cliHelper:CliHelper
    ) {}

    executeTestRunCli():void {
        try {
            var subCommand= this.process.getArgvOrThrow('subCommand', 3);
            if(subCommand=='cucumber') {
                var cucumberPassThruCommands = this.process.commandLineArguments().everythingAfterIndex(3);
                this.runCucumber(cucumberPassThruCommands);
            }
            else if(subCommand=='featureSet') {
                var featureSetId = this.process.getArgvOrThrow('featureSetId', 4);
                var featureSet = this.cucumber.featureSets.setWithId(featureSetId);
                var cucumberPassThruCommands = featureSet.featureFilesInExecutionOrder.append(this.process.commandLineArguments().everythingAfterIndex(4));
                this.runCucumber(cucumberPassThruCommands);
            }
            else if(subCommand=='command') {
                var command = this.process.commandLineArguments().everythingAfterIndex(3).join(' ');
                var clusters = this.clusterTestingConfiguration.clusterIds.map(
                    clusterId=>this.clusterTesting.newClusterUnderTest(this.clusters.clusterConfigurationWithId(clusterId))
                );
                var restrictNodesBasedOnServices = this.process.environmentVariables().hasKey('nodesWith');
                clusters.forEach(cluster=>{
                    var nodesForShellCommand = restrictNodesBasedOnServices
                        ? this.nodesRunningRequestedServices(cluster)
                        : cluster.nodes();
                    var commandPromises = nodesForShellCommand.map(n=>n.executeShellCommand(command));
                    this.promiseFactory.newGroupPromise(commandPromises)
                        .then(result=>{
                            this.console.log('*****************************************');
                            this.console.log(`Cluster Result for id "${cluster.name}`);
                            this.console.log("\n");
                            this.console.log(result.toJSONString());
                        });
                });
            }
            else throw new Error(`Invalid command ${subCommand}`);
        }
        catch(e) {
            this.logTestRunUsage();
            throw e;
        }
    }

    private runCucumber(cucumberPassThruCommands:IList<string>):void {
        this.multiClusterTester.runCucumberForEachClusterAndSaveResultsToPortalIfApplicable(cucumberPassThruCommands)
            .then(clusterTestResults => {
                var allPassed = clusterTestResults.all(t=>t.passed());
                if(clusterTestResults.length > 1) {
                    this.console.log(`Multi Cluster Test of ${clusterTestResults.length} clusters ${allPassed ? 'Passed' : 'Failed'}`);
                    clusterTestResults.forEach(result=>{
                        this.console.log(`Cluster ${result.clusterId}: ${result.passed() ? 'passed' : 'failed'}`);
                    })
                }
                this.process.exit(allPassed ? 0 : 1);
            })
            .catch(e => this.cliHelper.logError(e));
    }

    private nodesRunningRequestedServices(cluster:IClusterUnderTest):IList<INodeUnderTest> {
        var requisiteServiceNames = this.collections.newList<string>(this.process.environmentVariableNamed('nodesWith').split(','));
        return cluster.nodes().where(n=>n.serviceNames.containAll(requisiteServiceNames));
    }

    private logTestRunUsage():void {
        this.console.log([
            '',
            'Usage:',
            `${this.process.processName()} run [target]`,
            '',
            'targets                                         description',
            '-------                                         -----------',
            'featureSet [featureSetId]                       run cucumber with the specified featureset (to list available run command "featureSets")',
            'cucumber [args passed thru to cucumber.js]      reset cluster power or turn it off or on',
            'command [command]                               run arbitrary command on each node in cluster(s). If environment variable "nodesWith" is set',
            '                                                to a comma separated list of service names, then commands will only run on nodes that have those services'
        ].join('\n'));
    }
}