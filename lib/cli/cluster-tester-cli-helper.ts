import IProcess from "../node-js-wrappers/i-process";
import IConsole from "../node-js-wrappers/i-console";
import IUUIDGenerator from "../uuid/i-uuid-generator";
import ICucumber from "../cucumber/i-cucumber";
import ClusterTestingConfiguration from "../cluster-testing/cluster-testing-configuration";
import CliHelper from "./cli-helper";
import IList from "../collections/i-list";
import ClusterTesting from "../cluster-testing/cluster-testing";
import FrameworkConfiguration from "../framework/framework-configuration";
import IClusterVersionGraph from "../versioning/i-cluster-version-graph";
import ICucumberRunConfiguration from "../cucumber/i-cucumber-run-configuration";
import ICucumberTestResult from "../cucumber/i-cucumber-test-result";
import IPath from "../node-js-wrappers/i-path";
import IFileSystem from "../node-js-wrappers/i-filesystem";
import Rest from "../rest/rest";
import IClusterConfiguration from "../clusters/i-cluster-configuration";
import Clusters from "../clusters/clusters";
import IPromiseFactory from "../promise/i-promise-factory";
import IThenable from "../promise/i-thenable";
import ClusterTestResult from "../cluster-testing/cluster-test-result";
import ICollections from "../collections/i-collections";
import IClusterUnderTest from "../cluster-testing/i-cluster-under-test";
import INodeUnderTest from "../cluster-testing/i-node-under-test";

export default class ClusterTesterCliHelper {
    private process:IProcess;
    private console:IConsole;
    private uuidGenerator:IUUIDGenerator;
    private cucumber:ICucumber;
    private clusterTestingConfiguration:ClusterTestingConfiguration;
    private cliHelper:CliHelper;
    private clusterTesting:ClusterTesting;
    private frameworkConfig:FrameworkConfiguration;
    private path:IPath;
    private fileSystem:IFileSystem;
    private rest:Rest;
    private clusters:Clusters;
    private promiseFactory:IPromiseFactory;
    private collections:ICollections;

    constructor(process:IProcess, console:IConsole, uuidGenerator:IUUIDGenerator, cucumber:ICucumber, clusterTestingConfiguration:ClusterTestingConfiguration, cliHelper:CliHelper, clusterTesting:ClusterTesting, frameworkConfig:FrameworkConfiguration, path:IPath, fileSystem:IFileSystem, rest:Rest, clusters:Clusters, promiseFactory:IPromiseFactory, collections:ICollections) {
        this.process = process;
        this.console = console;
        this.uuidGenerator = uuidGenerator;
        this.cucumber = cucumber;
        this.clusterTestingConfiguration = clusterTestingConfiguration;
        this.cliHelper = cliHelper;
        this.clusterTesting = clusterTesting;
        this.frameworkConfig = frameworkConfig;
        this.path = path;
        this.fileSystem = fileSystem;
        this.rest = rest;
        this.clusters = clusters;
        this.promiseFactory = promiseFactory;
        this.collections = collections;
    }

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
                var clusters = this.clusterIds.map(clusterId=>this.clusterTesting.newClusterUnderTest(this.clusters.clusterConfigurationWithId(clusterId)));
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

    private nodesRunningRequestedServices(cluster:IClusterUnderTest):IList<INodeUnderTest> {
        var requisiteServiceNames = this.collections.newList<string>(this.process.environmentVariableNamed('nodesWith').split(','));
        return cluster.nodes().where(n=>n.serviceNames.containAll(requisiteServiceNames));
    }

    private get clusterIds():IList<string> {
        return this.collections.newList<string>(
            this.process.environmentVariables().hasKey('clusterIds')
                ? this.process.environmentVariableNamed('clusterIds').split(',')
                : this.process.environmentVariables().hasKey('clusterId')
                    ? [this.process.environmentVariableNamed('clusterId')]
                    : []
        );
    }

    //TODO: Decouple private methods from CLI and move to clusterTester so they can be invoked programmatically
    private runCucumber(cucumberPassThruCommands:IList<string>):void {
        var env = this.process.environmentVariables();
        var testRunUUID = this.uuidGenerator.v4();
        var clusterIds = this.clusterIds;
        var clusterTestResultPromises = clusterIds.map(clusterId=>{
            var clusterConfiguration = this.clusters.clusterConfigurationWithId(clusterId);
            var cucumberOutputPath = this.clusterTestingConfiguration.cucumberOutputPath;
            var uniqueFileIdentifier = `${testRunUUID}_${clusterId}_user-${this.process.currentUserName()}`;
            var outputFileName = `${uniqueFileIdentifier}.json`;
            var jsonResultFilePath = this.path.join(cucumberOutputPath, outputFileName);
            var envVars = this.process.environmentVariables().clone();
            envVars.add('clusterId', clusterId);
            var cucumberRunConfiguration = this.cucumber.newCucumberRunConfiguration(
                false,
                jsonResultFilePath,
                cucumberPassThruCommands.join(' '),
                envVars
            );
            return this.cucumber.newCucumberRunner(this.process, this.console).runCucumber(cucumberRunConfiguration)
                .then(cucumberTestResult => {
                    if(cucumberTestResult.processResult.hasError()) cucumberTestResult.processResult.stderrLines().map(l=>this.console.log(l));
                    return this.cliHelper.clusterForId(clusterId).versionGraph()
                        .then(versionGraph=> this.saveResult(versionGraph, null, cucumberRunConfiguration, cucumberTestResult, uniqueFileIdentifier, clusterConfiguration))
                        .catch(versionGraphError => this.saveResult(null, versionGraphError, cucumberRunConfiguration, cucumberTestResult, uniqueFileIdentifier, clusterConfiguration));
                });
        });
        
        this.promiseFactory.newGroupPromise(clusterTestResultPromises)
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

    //TODO: Decouple private methods from CLI and move to clusterTester so they can be invoked programmatically
    private saveResult(versionGraph:IClusterVersionGraph, versionGraphError:string, cucumberRunConfiguration:ICucumberRunConfiguration, cucumberTestResult:ICucumberTestResult, uniqueFileIdentifier:string, clusterConfiguration:IClusterConfiguration):IThenable<ClusterTestResult> {
        var clusterTestResult = this.clusterTesting.newClusterTestResult(
            cucumberRunConfiguration,
            cucumberTestResult,
            this.frameworkConfig,
            versionGraph,
            versionGraphError,
            clusterConfiguration
        );

        this.console.log(cucumberTestResult.consoleOutput());

        var outputFileName = `${uniqueFileIdentifier}.json`;
        var frameworkOutputPath = this.path.join(
            this.clusterTestingConfiguration.frameworkOutputPath,
            outputFileName
        );
        this.fileSystem.writeFileSync(
            frameworkOutputPath,
            clusterTestResult.toString()
        );

        if(this.process.environmentVariables().hasKey('portalId')) {
            var portalId = this.process.environmentVariableNamed('portalId');
            var url = this.clusterTestingConfiguration.portalUrlWithId(portalId);
            var fullUrl = `${url}/test-results/${uniqueFileIdentifier}`;
            var putArgs = {
                body: clusterTestResult.toJSON(),
                json: true
            }
            var portalInfo = `portal id "${portalId}" at url "${fullUrl}"`;
            this.console.log(`Saving result to ${portalInfo}`);
            return this.rest.newRestClientAsPromised().put(fullUrl, putArgs)
                .then(result => this.console.log('Success'))
                .catch(error => this.cliHelper.logError(error))
                .then(_ => clusterTestResult);
        } else {
            var locationOfConfiguredPortalUrls = 'the configuration json file, under "clusterTesting.resultServers"';
            this.console.log(`Not saving result to portal. To do so, set ENV variable "portalId" to value in ${locationOfConfiguredPortalUrls}`);
            return this.promiseFactory.newPromiseForImmediateValue(clusterTestResult);
        }
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