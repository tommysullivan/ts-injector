import IClusterVersionGraph from "../versioning/i-cluster-version-graph";
import ICucumberTestResult from "../cucumber/i-cucumber-test-result";
import IClusterConfiguration from "../clusters/i-cluster-configuration";
import IFileSystem from "../node-js-wrappers/i-filesystem";
import Rest from "../rest/rest";
import FrameworkConfiguration from "../framework/framework-configuration";
import IThenable from "../promise/i-thenable";
import ClusterTestResult from "./cluster-test-result";
import ClusterTesting from "./cluster-testing";
import IConsole from "../node-js-wrappers/i-console";
import ClusterTestingConfiguration from "./cluster-testing-configuration";
import IProcess from "../node-js-wrappers/i-process";
import IPromiseFactory from "../promise/i-promise-factory";
import IPath from "../node-js-wrappers/i-path";
import IList from "../collections/i-list";
import NodeLog from "./node-log";
import IJSONObject from "../typed-json/i-json-object";

export default class ResultReporter {

    constructor(
        private frameworkConfig:FrameworkConfiguration,
        private fileSystem:IFileSystem,
        private rest:Rest,
        private clusterTesting:ClusterTesting,
        private console:IConsole,
        private clusterTestingConfiguration:ClusterTestingConfiguration,
        private process:IProcess,
        private promiseFactory:IPromiseFactory,
        private path:IPath
    ) {}

    saveResult(versionGraph:IClusterVersionGraph, versionGraphError:string, cucumberTestResult:ICucumberTestResult, uniqueFileIdentifier:string, clusterConfiguration:IClusterConfiguration, logs:IList<NodeLog>, testRunGUID:string, packageJson:IJSONObject):IThenable<ClusterTestResult> {
        var clusterTestResult = this.clusterTesting.newClusterTestResult(
            cucumberTestResult,
            this.frameworkConfig,
            versionGraph,
            versionGraphError,
            clusterConfiguration,
            logs,
            uniqueFileIdentifier,
            testRunGUID,
            packageJson
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
                .catch(error => this.console.log(error.toString()))
                .then(_ => clusterTestResult);
        } else {
            var locationOfConfiguredPortalUrls = 'the configuration json file, under "clusterTesting.resultServers"';
            this.console.log(`Not saving result to portal. To do so, set ENV variable "portalId" to value in ${locationOfConfiguredPortalUrls}`);
            return this.promiseFactory.newPromiseForImmediateValue(clusterTestResult);
        }
    }
}