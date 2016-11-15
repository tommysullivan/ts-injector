import {IFuture} from "../promise/i-future";
import {IList} from "../collections/i-list";
import {IUUIDGenerator} from "../uuid/i-uuid-generator";
import {IProcess} from "../node-js-wrappers/i-process";
import {IConsole} from "../node-js-wrappers/i-console";
import {IPromiseFactory} from "../promise/i-promise-factory";
import {IClusterTestingConfiguration} from "./i-cluster-testing-configuration";
import {IClusterTestResult} from "./i-cluster-test-result";
import {IClusters} from "../clusters/i-clusters";
import {IMultiClusterTester} from "./i-multi-cluster-tester";
import {IClusterResultPreparer} from "./i-cluster-result-preparer";
import {CucumberCli} from "../cucumber/cucumber-cli";
import {IResultReporter} from "../testing/i-result-reporter";
import {IJSONSerializer} from "../typed-json/i-json-serializer";

export class MultiClusterTester implements IMultiClusterTester {

    constructor(
        private uuidGenerator:IUUIDGenerator,
        private clusterTestingConfiguration:IClusterTestingConfiguration,
        private clusters:IClusters,
        private process:IProcess,
        private console:IConsole,
        private promiseFactory:IPromiseFactory,
        private clusterResultPreparer:IClusterResultPreparer,
        private cucumberCli:CucumberCli,
        private resultReporter:IResultReporter,
        private jsonSerializer:IJSONSerializer
    ) {}

    runCucumberForEachClusterAndSaveResultsToPortalIfApplicable(cucumberPassThruCommands:IList<string>):IFuture<IList<IClusterTestResult>> {
        const testRunUUID = this.uuidGenerator.v4();
        if (this.clusterTestingConfiguration.clusterIds.length==0)
            this.console.warn(
                `No cluster(s) specified in ENV variables clusterId or clusterIds.`,
                'Valid cluster Ids:',
                this.clusters.allIds.toString()
            );

        const clusterTestResultPromises = this.clusterTestingConfiguration.clusterIds.map(
            clusterId => this.runCucumberForClusterAndSaveResultToPortalIfApplicable(testRunUUID, clusterId, cucumberPassThruCommands)
        );

        return this.promiseFactory.newGroupPromiseFromArray(clusterTestResultPromises)
            .then(clusterTestResults => {
                this.console.info(`Test Run GUID : ${testRunUUID}`);
                return clusterTestResults;
            });
    }

    private runCucumberForClusterAndSaveResultToPortalIfApplicable(testRunUUID: string, clusterId, cucumberPassThruCommands: IList<string>):IFuture<IClusterTestResult> {
        const uniqueFileIdentifier = `${testRunUUID}_${clusterId}_user-${this.process.currentUserName}`;
        const envVars = this.process.environmentVariables.clone();
        const envVarsWithClusterId = envVars.add('clusterId', clusterId);
        return this.cucumberCli.configureAndRunCucumber(uniqueFileIdentifier, cucumberPassThruCommands, envVarsWithClusterId)
            .then(cucumberTestResult => this.clusterResultPreparer.prepareClusterResult(
                clusterId,
                cucumberTestResult,
                uniqueFileIdentifier,
                testRunUUID
            ))
            .then(clusterTestResult =>
                this.resultReporter.reportResult(
                    uniqueFileIdentifier,
                    this.jsonSerializer.serializeToString(clusterTestResult)
                )
                .then(_ => clusterTestResult)
            );
    }
}
