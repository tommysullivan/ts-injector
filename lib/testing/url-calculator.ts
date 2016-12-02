import {IURLCalculator} from "./i-url-calculator";
import {ITestingConfiguration} from "./i-testing-configuration";

export class URLCalculator implements IURLCalculator{
    constructor(
        private testingConfig:ITestingConfiguration
    ){}

    public calculateURL(testRunUUID:string):string {
        const url = this.testingConfig.portalUrl;
        return `${url}/test-results/${testRunUUID}`;
    }
}