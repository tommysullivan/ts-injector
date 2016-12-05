import {ICucumberTestResult} from "./i-cucumber-test-result";
import {IFuture} from "../futures/i-future";
import {IDictionary} from "../collections/i-dictionary";
import {IList} from "../collections/i-list";
import {ICucumberRunner} from "./i-cucumber-runner";
import {ICucumberConfiguration} from "./i-cucumber-configuration";
import {IPath} from "../node-js-wrappers/i-path";
import {ICucumber} from "./i-cucumber";
import {IFileSystem} from "../node-js-wrappers/i-filesystem";
import {IConsole} from "../node-js-wrappers/i-console";

export class CucumberCli {
    constructor(
        private cucumberRunner:ICucumberRunner,
        private cucumberConfig:ICucumberConfiguration,
        private path:IPath,
        private cucumber:ICucumber,
        private fileSystem:IFileSystem,
        private console:IConsole
    ) {}

    configureAndRunCucumber(uniqueIdentifier: string, cucumberPassThruCommands: IList<string>, environmentVariables: IDictionary<string>):IFuture<ICucumberTestResult> {
        const cucumberOutputPath = this.cucumberConfig.cucumberOutputPath;
        const outputFileName = `${uniqueIdentifier}.json`;
        const jsonResultFilePath = this.path.join(cucumberOutputPath, outputFileName);
        const cucumberRunConfiguration = this.cucumber.newCucumberRunConfiguration(
            false,
            jsonResultFilePath,
            cucumberPassThruCommands.join(' '),
            environmentVariables
        );

        if (!this.fileSystem.checkFileExistSync(cucumberOutputPath))
            this.fileSystem.makeDirRecursive(cucumberOutputPath);

        return this.cucumberRunner
            .runCucumber(cucumberRunConfiguration)
            .then(cucumberTestResult => {
                this.console.log(cucumberTestResult.consoleOutput);
                return cucumberTestResult;
            });
    }
}