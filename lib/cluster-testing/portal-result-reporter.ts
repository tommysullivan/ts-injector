import {IResultReporter} from "./i-result-reporter";
import {IFuture} from "../promise/i-future";
import {IConsole} from "../node-js-wrappers/i-console";
import {IProcess} from "../node-js-wrappers/i-process";
import {IPromiseFactory} from "../promise/i-promise-factory";
import {IClusterTestingConfiguration} from "./i-cluster-testing-configuration";
import {IClusterTestResult} from "./i-cluster-test-result";
import {IRest} from "../rest/i-rest";

export class PortalResultReporter implements IResultReporter {
    constructor(
        private rest:IRest,
        private console:IConsole,
        private process:IProcess,
        private clusterTestingConfiguration:IClusterTestingConfiguration,
        private promiseFactory:IPromiseFactory
    ) {}

    reportResult(uniqueFileIdentifier:string, clusterTestResult:IClusterTestResult):IFuture<IClusterTestResult>  {
        if(this.process.environmentVariables.hasKey('portalId')) {
            const url = this.clusterTestingConfiguration.portalUrl;
            const fullUrl = `${url}/test-results/${uniqueFileIdentifier}`;
            const putArgs = {
                body: clusterTestResult.toJSON(),
                json: true
            };
            const portalId = this.process.environmentVariableNamed('portalId');
            const portalInfo = `portal id "${portalId}" at url "${fullUrl}"`;
            this.console.log(`Saving result to ${portalInfo}`);
            return this.rest.newRestClientAsPromised().put(fullUrl, putArgs)
                .then(result => this.console.log('Success'))
                .catch(error => this.console.log(error.toString()))
                .then(_ => clusterTestResult);
        } else {
            const locationOfConfiguredPortalUrls = 'the configuration json file, under "clusterTesting.resultServers"';
            this.console.log(`Not saving result to portal. To do so, set ENV variable "portalId" to value in ${locationOfConfiguredPortalUrls}`);
            return this.promiseFactory.newPromiseForImmediateValue(clusterTestResult);
        }
    }
}