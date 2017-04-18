import {IList} from "../collections/i-list";
import {IUUIDGenerator} from "../uuid/i-uuid-generator";
import {IProcess} from "../node-js-wrappers/i-process";
import {IConsole} from "../console/i-console";
import {IMultiClusterTester} from "./i-multi-cluster-tester";
import {IClusterResultPreparer} from "./i-cluster-result-preparer";
import {CucumberCli} from "../cucumber/cucumber-cli";
import {IResultReporter} from "../testing/i-result-reporter";
import {IJSONSerializer} from "../typed-json/i-json-serializer";
import {IURLCalculator} from "../testing/i-url-calculator";
import {IFuture} from "../futures/i-future";
import {ITestResult} from "../testing/i-test-result";

export class MultiClusterTester implements IMultiClusterTester {

    constructor(
        private uuidGenerator:IUUIDGenerator,
        private process:IProcess,
        private console:IConsole,
        private clusterResultPreparer:IClusterResultPreparer,
        private cucumberCli:CucumberCli,
        private resultReporter:IResultReporter,
        private jsonSerializer:IJSONSerializer,
        private urlCalculator:IURLCalculator
    ) {}

    runCucumberForEachClusterAndSaveResultsToPortalIfApplicable(clusterIds:IList<string>, cucumberPassThruCommands:IList<string>):IFuture<IList<ITestResult>> {
        const testRunUUID = this.uuidGenerator.v4();
        if (this.process.environmentVariables.hasKey('portalId'))
            this.urlCalculator.writeUrlsToPropertiesFile(
                clusterIds.map(
                    clusterId => this.urlCalculator.calculateURL(`${testRunUUID}_${clusterId}_user-${this.process.currentUserName}`)
                )
            );
        return clusterIds
            .mapToFutureList(clusterId => this.runCucumberForClusterAndSaveResultToPortalIfApplicable(
                testRunUUID,
                clusterId,
                cucumberPassThruCommands
            ))
            .then(clusterTestResults => {
                this.console.info(`Test Run GUID : ${testRunUUID}`);
                return clusterTestResults;
            });
    }

    private runCucumberForClusterAndSaveResultToPortalIfApplicable(testRunUUID: string, clusterId, cucumberPassThruCommands: IList<string>):IFuture<ITestResult> {
        const uniqueFileIdentifier = `${testRunUUID}_${clusterId}_user-${this.process.currentUserName}`;
        const envVars = this.process.environmentVariables.clone();
        const envVarsWithClusterId = envVars.add('clusterId', clusterId);
        return this.cucumberCli.configureAndRunCucumber(uniqueFileIdentifier, cucumberPassThruCommands, envVarsWithClusterId)
            .then(cucumberTestResult => this.clusterResultPreparer.prepareClusterResult(
                    clusterId,
                    cucumberTestResult,
                    uniqueFileIdentifier,
                    testRunUUID
                )
            )
            .then(clusterTestResult =>
                this.resultReporter.reportResult(
                    uniqueFileIdentifier,
                    this.jsonSerializer.serializeToString(clusterTestResult)
                )
                .then(_ => clusterTestResult)
            );
    }
}
