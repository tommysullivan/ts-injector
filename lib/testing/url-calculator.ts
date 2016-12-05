import {IURLCalculator} from "./i-url-calculator";
import {ITestingConfiguration} from "./i-testing-configuration";
import {IFileSystem} from "../node-js-wrappers/i-filesystem";
import {IList} from "../collections/i-list";

export class URLCalculator implements IURLCalculator{
    constructor(
        private testingConfig:ITestingConfiguration,
        private fileSystem:IFileSystem
    ){}

    public calculateURL(testRunUUID:string):string {
        const url = this.testingConfig.portalUrl;
        return `${url}/test-results/${testRunUUID}`;
    }

    public writeUrlsToPropertiesFile(urls:IList<string>):void {
        this.writeUrlToPropertiesFile(urls.join(`,`))
    }

    public writeUrlToPropertiesFile(url:string):void {
        this.fileSystem.writeFileSync("url.properties", `TESTURLS=${url}`);
    }
}