import {IConsole} from "../node-js-wrappers/i-console";
import {ICollections} from "../collections/i-collections";
import {ICucumberTestResult} from "../cucumber/i-cucumber-test-result";
import {IFileSystem} from "../node-js-wrappers/i-filesystem";
import {IFuture} from "../promise/i-future";
import {IFrameworkConfiguration} from "../framework/i-framework-configuration";
import {IClusterVersionGraph} from "../versioning/i-cluster-version-graph";
import {IResultReporter} from "./i-result-reporter";
import {IClusterTestingConfiguration} from "./i-cluster-testing-configuration";
import {IClusters} from "../clusters/i-clusters";
import {IClusterResultPreparer} from "./i-cluster-result-preparer";
import {IClusterTesting} from "./i-cluster-testing";
import {IClusterLogCapturer} from "./i-cluster-log-capturer";
import {INodeLog} from "./i-node-log";
import {IProcess} from "../node-js-wrappers/i-process";

export class ClusterResultPreparer implements IClusterResultPreparer {
    constructor(
        private clusterLogCapturer:IClusterLogCapturer,
        private console:IConsole,
        private resultReporter:IResultReporter,
        private collections:ICollections,
        private clusterTestingConfiguration:IClusterTestingConfiguration,
        private fileSystem:IFileSystem,
        private clusters:IClusters,
        private clusterTesting:IClusterTesting,
        private frameworkConfig:IFrameworkConfiguration,
        private process:IProcess
    ) {}

    prepareAndSaveClusterResult(clusterId:string, cucumberTestResult:ICucumberTestResult, uniqueFileIdentifier:string, testRunGUID:string):IFuture<any> {
        var packageJson = null;
        try {
            packageJson = this.fileSystem.readJSONObjectFileSync('./package.json');
        }
        catch(e) {
            if(this.clusterTestingConfiguration.throwErrorIfPackageJsonMissing)
                throw new Error(`Package.json could not be loaded. To suppress this error, set clusterTestingConfiguration.throwErrorIfPackageJsonMissing in configuration. ${e.toString()}`);
            else
                this.console.warn(`Package.json could not be loaded, and error was suppressed due to configuration of clusterTestingConfiguration.throwErrorIfPackageJsonMissing. Error ${e.toString()}`);
        }
        const clusterConfiguration = this.clusters.clusterConfigurationWithId(clusterId);
        const cluster = this.clusterTesting.clusterForId(clusterId);
        
        const jenkinsURL = this.process.environmentVariableNamedOrDefault('BUILD_URL', null);
        const currentUser = this.process.environmentVariableNamedOrDefault('USER', null);
        const gitCloneURL = this.process.environmentVariableNamedOrDefault('gitCloneURL', null);
        const gitSHA = this.process.environmentVariableNamedOrDefault('gitSHA', null);

        return this.clusterLogCapturer.captureLogs(cluster)
            .catch(error => {
                this.console.log(`Warning: could not capture logs for cluster: ${error.toString()}`);
                return this.collections.newEmptyList<INodeLog>();
            })
            .then(logs => {
                const createClusterTestResult = (versionGraph:IClusterVersionGraph, versionGraphError:string) => {
                    return this.clusterTesting.newClusterTestResult(
                        cucumberTestResult,
                        this.frameworkConfig,
                        versionGraph,
                        versionGraphError,
                        clusterConfiguration,
                        logs,
                        uniqueFileIdentifier,
                        testRunGUID,
                        packageJson,
                        jenkinsURL,
                        currentUser,
                        gitCloneURL,
                        gitSHA
                    );
                };
                return cluster.versionGraph()
                    .then(
                        versionGraph => this.resultReporter.reportResult(
                            uniqueFileIdentifier,
                            createClusterTestResult(versionGraph, null)
                        ),
                        versionGraphError => {
                            this.console.log(`Warning: could not capture version graph for cluster. Error: ${versionGraphError}`);
                            return this.resultReporter.reportResult(
                                uniqueFileIdentifier,
                                createClusterTestResult(null, versionGraphError)
                            )
                        }
                    );
            });
    }
}