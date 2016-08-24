import IThenable from "../promise/i-thenable";
import ClusterTestResult from "../cluster-testing/cluster-test-result";
import IList from "../collections/i-list";
import IUUIDGenerator from "../uuid/i-uuid-generator";
import IPath from "../node-js-wrappers/i-path";
import Clusters from "../clusters/clusters";
import ClusterTestingConfiguration from "./cluster-testing-configuration";
import IProcess from "../node-js-wrappers/i-process";
import ICucumber from "../cucumber/i-cucumber";
import IConsole from "../node-js-wrappers/i-console";
import IPromiseFactory from "../promise/i-promise-factory";
import ClusterTesting from "./cluster-testing";
import ResultReporter from "./result-reporter";
import ClusterLogCapturer from "./cluster-log-capturer";
import NodeLog from "./node-log";
import ICollections from "../collections/i-collections";
import IFileSystem from "../node-js-wrappers/i-filesystem";
import IJSONObject from "../typed-json/i-json-object";

export default class MultiClusterTester {

    constructor(
        private uuidGenerator:IUUIDGenerator,
        private path:IPath,
        private clusterTestingConfiguration:ClusterTestingConfiguration,
        private clusters:Clusters,
        private process:IProcess,
        private cucumber:ICucumber,
        private console:IConsole,
        private promiseFactory:IPromiseFactory,
        private clusterTesting:ClusterTesting,
        private resultReporter:ResultReporter,
        private clusterLogCapturer:ClusterLogCapturer,
        private collections:ICollections,
        private fileSystem:IFileSystem
    ) {}

    runCucumberForEachClusterAndSaveResultsToPortalIfApplicable(cucumberPassThruCommands:IList<string>):IThenable<IList<ClusterTestResult>> {
        const testRunUUID = this.uuidGenerator.v4();
        if (this.clusterTestingConfiguration.clusterIds.isEmpty) this.console.log('WARN: No clusters specified. Set environment variable clusterId or clusterIds to value(s) from configuration/config.json');
        const clusterTestResultPromises = this.clusterTestingConfiguration.clusterIds.map(clusterId=> {
            const clusterConfiguration = this.clusters.clusterConfigurationWithId(clusterId);
            const cucumberOutputPath = this.clusterTestingConfiguration.cucumberOutputPath;
            const uniqueFileIdentifier = `${testRunUUID}_${clusterId}_user-${this.process.currentUserName()}`;
            const outputFileName = `${uniqueFileIdentifier}.json`;
            const jsonResultFilePath = this.path.join(cucumberOutputPath, outputFileName);
            const envVars = this.process.environmentVariables().clone();
            envVars.add('clusterId', clusterId);
            const cucumberRunConfiguration = this.cucumber.newCucumberRunConfiguration(
                false,
                jsonResultFilePath,
                cucumberPassThruCommands.join(' '),
                envVars
            );

            const cluster = this.clusterTesting.clusterForId(clusterId);

            const packageJson = this.clusterTestingConfiguration.throwErrorIfPackageJsonMissing ? this.fileSystem.readJSONObjectFileSync('./package.json') : null;

            return this.cucumber.newCucumberRunner(this.process, this.console).runCucumber(cucumberRunConfiguration)
                .then(cucumberTestResult => {
                    return this.clusterLogCapturer.captureLogs(cluster)
                        .catch(error => {
                            this.console.log(`Error capturing logs for cluster: ${error.toString()}`);
                            return this.collections.newEmptyList<NodeLog>();
                        })
                        .then(logs => {
                            return cluster.versionGraph()
                                .then(versionGraph=> this.resultReporter.saveResult(versionGraph, null, cucumberTestResult, uniqueFileIdentifier, clusterConfiguration, logs, testRunUUID, packageJson))
                                .catch(versionGraphError => this.resultReporter.saveResult(null, versionGraphError, cucumberTestResult, uniqueFileIdentifier, clusterConfiguration, logs, testRunUUID, packageJson));
                        });
                });
        });

        return this.promiseFactory.newGroupPromise(clusterTestResultPromises)
            .then(clusterTestResults => {
                this.console.log(`Test Run GUID : ${testRunUUID}`);
                return clusterTestResults;
            });
    }
}
