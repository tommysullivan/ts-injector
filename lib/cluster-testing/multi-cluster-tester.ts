import {IFuture} from "../promise/i-future";
import {IList} from "../collections/i-list";
import {IUUIDGenerator} from "../uuid/i-uuid-generator";
import {IPath} from "../node-js-wrappers/i-path";
import {IProcess} from "../node-js-wrappers/i-process";
import {ICucumber} from "../cucumber/i-cucumber";
import {IConsole} from "../node-js-wrappers/i-console";
import {IPromiseFactory} from "../promise/i-promise-factory";
import {IClusterTestingConfiguration} from "./i-cluster-testing-configuration";
import {IClusterTestResult} from "./i-cluster-test-result";
import {IClusters} from "../clusters/i-clusters";
import {IMultiClusterTester} from "./i-multi-cluster-tester";
import {IClusterResultPreparer} from "./i-cluster-result-preparer";
import {IFileSystem} from "../node-js-wrappers/i-filesystem";

export class MultiClusterTester implements IMultiClusterTester {

    constructor(
        private uuidGenerator:IUUIDGenerator,
        private path:IPath,
        private clusterTestingConfiguration:IClusterTestingConfiguration,
        private clusters:IClusters,
        private process:IProcess,
        private cucumber:ICucumber,
        private console:IConsole,
        private promiseFactory:IPromiseFactory,
        private clusterResultPreparer:IClusterResultPreparer,
        private fileSystem:IFileSystem
    ) {}

    runCucumberForEachClusterAndSaveResultsToPortalIfApplicable(cucumberPassThruCommands:IList<string>):IFuture<IList<IClusterTestResult>> {
        const testRunUUID = this.uuidGenerator.v4();
        if (this.clusterTestingConfiguration.clusterIds.length==0)
            this.console.warn(
                `No cluster(s) specified in ENV variables clusterId or clusterIds.`,
                'Valid cluster Ids:',
                this.clusters.allIds.toString()
            );

        const clusterTestResultPromises = this.clusterTestingConfiguration.clusterIds.map(clusterId=> {
            const cucumberOutputPath = this.clusterTestingConfiguration.cucumberOutputPath;
            const uniqueFileIdentifier = `${testRunUUID}_${clusterId}_user-${this.process.currentUserName}`;
            const outputFileName = `${uniqueFileIdentifier}.json`;
            const jsonResultFilePath = this.path.join(cucumberOutputPath, outputFileName);
            const envVars = this.process.environmentVariables.clone();
            const envVarsWithClusterId = envVars.add('clusterId', clusterId);
            if(!this.fileSystem.checkFileExistSync(cucumberOutputPath))
                   this.fileSystem.makeDirRecursive(cucumberOutputPath);
            const cucumberRunConfiguration = this.cucumber.newCucumberRunConfiguration(
                false,
                jsonResultFilePath,
                cucumberPassThruCommands.join(' '),
                envVarsWithClusterId
            );

            return this.cucumber
                .newCucumberRunner(this.process, this.console)
                .runCucumber(cucumberRunConfiguration)
                .then(cucumberTestResult => {
                    this.console.log(cucumberTestResult.consoleOutput);
                    return this.clusterResultPreparer.prepareAndSaveClusterResult(
                        clusterId,
                        cucumberTestResult,
                        uniqueFileIdentifier,
                        testRunUUID
                    );
                });
        });

        return this.promiseFactory.newGroupPromiseFromArray(clusterTestResultPromises)
            .then(clusterTestResults => {
                this.console.log(`Test Run GUID : ${testRunUUID}`);
                return clusterTestResults;
            });
    }
}
