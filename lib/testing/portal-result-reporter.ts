import {IResultReporter} from "./i-result-reporter";
import {IConsole} from "../console/i-console";
import {IProcess} from "../node-js-wrappers/i-process";
import {IRest} from "../rest/common/i-rest";
import {IFutures} from "../futures/i-futures";
import {IFuture} from "../futures/i-future";
import {IURLCalculator} from "./i-url-calculator";
import {IJSONParser} from "../typed-json/i-json-parser";

export class PortalResultReporter implements IResultReporter {
    constructor(private rest: IRest,
                private console: IConsole,
                private process: IProcess,
                private urlCalculator: IURLCalculator,
                private futures: IFutures,
                private jsonParser: IJSONParser) {
    }

    reportResult(uniqueFileIdentifier: string, portalCompatibleJSONResultString: string): IFuture<string> {
        if (this.process.environmentVariables.hasKey('portalId')) {
            const fullUrl = this.urlCalculator.calculateURL(uniqueFileIdentifier);
            const portalId = this.process.environmentVariableNamed('portalId');
            const portalInfo = `portal id "${portalId}" at url "${fullUrl}"`;
            this.console.log(`Saving result to ${portalInfo}`);
            return this.rest.newRestClient()
                .put(
                    fullUrl,
                    this.jsonParser.parse(portalCompatibleJSONResultString)
                )
                .then(_ => {
                    this.console.log('Success');
                    return fullUrl;
                })
                .catch(error => this.console.log(error.toString()))
        } else {
            const locationOfConfiguredPortalUrls = 'the configuration json file, under "testing.resultServers"';
            this.console.log(`Not saving result to portal. To do so, set ENV variable "portalId" to value in ${locationOfConfiguredPortalUrls}`);
            return this.futures.newFutureForImmediateValue(null);
        }
    }
}