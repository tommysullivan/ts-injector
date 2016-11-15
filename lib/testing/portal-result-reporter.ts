import {IResultReporter} from "./i-result-reporter";
import {IFuture} from "../promise/i-future";
import {IConsole} from "../node-js-wrappers/i-console";
import {IProcess} from "../node-js-wrappers/i-process";
import {IPromiseFactory} from "../promise/i-promise-factory";
import {IRest} from "../rest/i-rest";
import {ITestingConfiguration} from "./i-testing-configuration";

export class PortalResultReporter implements IResultReporter {
    constructor(
        private rest:IRest,
        private console:IConsole,
        private process:IProcess,
        private testingConfiguration:ITestingConfiguration,
        private promiseFactory:IPromiseFactory
    ) {}

    reportResult(uniqueFileIdentifier:string, portalCompatibleJSONResultString:string):IFuture<any> {
        if(this.process.environmentVariables.hasKey('portalId')) {
            const url = this.testingConfiguration.portalUrl;
            const fullUrl = `${url}/test-results/${uniqueFileIdentifier}`;
            const putArgs = {
                body: JSON.parse(portalCompatibleJSONResultString),
                json: true
            };
            const portalId = this.process.environmentVariableNamed('portalId');
            const portalInfo = `portal id "${portalId}" at url "${fullUrl}"`;
            this.console.log(`Saving result to ${portalInfo}`);
            return this.rest.newRestClientAsPromised().put(fullUrl, putArgs)
                .then(result => this.console.log('Success'))
                .catch(error => this.console.log(error.toString()))
        } else {
            const locationOfConfiguredPortalUrls = 'the configuration json file, under "testing.resultServers"';
            this.console.log(`Not saving result to portal. To do so, set ENV variable "portalId" to value in ${locationOfConfiguredPortalUrls}`);
            return this.promiseFactory.newPromiseForImmediateValue(null);
        }
    }
}