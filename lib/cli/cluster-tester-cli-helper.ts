import IProcess from "../node-js-wrappers/i-process";
import IConsole from "../node-js-wrappers/i-console";
import IUUIDGenerator from "../uuid/i-uuid-generator";
import Cucumber from "../cucumber/cucumber";
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

export default class ClusterTesterCliHelper {
    private process:IProcess;
    private console:IConsole;
    private uuidGenerator:IUUIDGenerator;
    private cucumber:Cucumber;
    private clusterTestingConfiguration:ClusterTestingConfiguration;
    private cliHelper:CliHelper;
    private clusterTesting:ClusterTesting;
    private frameworkConfig:FrameworkConfiguration;
    private path:IPath;
    private fileSystem:IFileSystem;
    private rest:Rest;
    private clusters:Clusters;

    constructor(process:IProcess, console:IConsole, uuidGenerator:IUUIDGenerator, cucumber:Cucumber, clusterTestingConfiguration:ClusterTestingConfiguration, cliHelper:CliHelper, clusterTesting:ClusterTesting, frameworkConfig:FrameworkConfiguration, path:IPath, fileSystem:IFileSystem, rest:Rest, clusters:Clusters) {
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
                var featureSet = this.cucumber.allFeatureSets.firstWhere(f=>f.id==featureSetId);
                var cucumberPassThruCommands = featureSet.featureFilesInExecutionOrder.append(this.process.commandLineArguments().everythingAfterIndex(4));
                this.runCucumber(cucumberPassThruCommands);
            }
            else throw new Error(`Invalid command ${subCommand}`);
        }
        catch(e) {
            this.logTestRunUsage();
            throw e;
        }
    }

    //TODO: Decouple private methods from CLI and move to clusterTester so they can be invoked programmatically
    private runCucumber(cucumberPassThruCommands:IList<string>):void {
        var env = this.process.environmentVariables();
        var testRunUUID = this.uuidGenerator.v4();
        var phase = this.clusterTestingConfiguration.defaultPhase;
        var clusterId = this.process.environmentVariableNamed('clusterId');
        var clusterConfiguration = this.clusters.clusterConfigurationWithId(clusterId);
        var cucumberOutputPath = this.clusterTestingConfiguration.cucumberOutputPath;
        var uniqueFileIdentifier = `${testRunUUID}_${clusterId}_phase-${phase}_user-${this.process.currentUserName()}`;
        var outputFileName = `${uniqueFileIdentifier}.json`;
        var jsonResultFilePath = this.path.join(cucumberOutputPath, outputFileName);
        var cucumberRunConfiguration = this.cucumber.newCucumberRunConfiguration(
            false,
            jsonResultFilePath,
            cucumberPassThruCommands.join(' '),
            this.process.environmentVariables().clone()
        );
        this.cucumber.newCucumberRunner(this.process, this.console).runCucumber(cucumberRunConfiguration)
            .then(cucumberTestResult => {
                return this.cliHelper.clusterForId(clusterId).versionGraph()
                    .then(versionGraph=> this.saveResult(versionGraph, null, cucumberRunConfiguration, cucumberTestResult, uniqueFileIdentifier, clusterConfiguration))
                    .catch(versionGraphError => this.saveResult(null, versionGraphError, cucumberRunConfiguration, cucumberTestResult, uniqueFileIdentifier, clusterConfiguration));
            })
            .catch(e => this.cliHelper.logError(e));
    }

    //TODO: Decouple private methods from CLI and move to clusterTester so they can be invoked programmatically
    private saveResult(versionGraph:IClusterVersionGraph, versionGraphError:string, cucumberRunConfiguration:ICucumberRunConfiguration, cucumberTestResult:ICucumberTestResult, uniqueFileIdentifier:string, clusterConfiguration:IClusterConfiguration):void {
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
            this.rest.newRestClientAsPromised().put(fullUrl, putArgs)
                .then(result => this.console.log('Success'))
                .catch(error => this.cliHelper.logError(error));
        } else {
            var locationOfConfiguredPortalUrls = 'the configuration json file, under "clusterTesting.resultServers"';
            this.console.log(`Not saving result to portal. To do so, set ENV variable "portalId" to value in ${locationOfConfiguredPortalUrls}`);
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
            'cucumber [args passed thru to cucumber.js]      reset cluster power or turn it off or on'
        ].join('\n'));
    }
}