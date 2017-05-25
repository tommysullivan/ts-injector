import {IProcess} from "../node-js-wrappers/i-process";
import {IFuture} from "../futures/i-future";
import {ICucumberTestResult} from "./i-cucumber-test-result";
import {IConsole} from "../console/i-console";
import {ICucumberRunConfiguration} from "./i-cucumber-run-configuration";
import {ICucumberRunner} from "./i-cucumber-runner";
import {IProcessResult} from "../node-js-wrappers/i-process-result";
import {ICollections} from "../collections/i-collections";
import {ICucumberConfiguration} from "./i-cucumber-configuration";
import {ICucumber} from "./i-cucumber";

export class CucumberRunner implements ICucumberRunner {
    constructor(
        private process:IProcess,
        private console:IConsole,
        private cucumber:ICucumber,
        private cucumberConfig:ICucumberConfiguration,
        private collections:ICollections
    ) {}

    runCucumber(runConfig:ICucumberRunConfiguration):IFuture<ICucumberTestResult> {
        const startTime = new Date();
        const dryRunArg = runConfig.isDryRun ? ' --dry-run' : '';
        const additionalArgs = `${runConfig.cucumberAdditionalArgs}${dryRunArg}`;
        const runCucumberCommand = [
            this.cucumberConfig.cucumberExecutablePath,
            additionalArgs,
            `-f json:${runConfig.jsonResultFilePath}`
        ].join(' ');

        this.console.log('cucumber command: ', runCucumberCommand);
        this.console.log(
            'environment variables: ',
            runConfig.environmentVariables
        );
        const envVars = this.collections.newDictionary(runConfig.environmentVariables);
        return this.process.executeNodeProcess(runCucumberCommand, envVars)
            .onProgress(progress => {
                if(progress.stdErr) this.console.error(progress.stdErr);
                else this.console.log(progress.stdOut);
            })
            .then(
                r => this.onCucumberProcessComplete(r, runConfig, startTime),
                r => this.onCucumberProcessComplete(r, runConfig, startTime)
            );
    }

    private onCucumberProcessComplete(processResult:IProcessResult, cucumberRunConfiguration:ICucumberRunConfiguration, startTime:Date):ICucumberTestResult {
        return this.cucumber.newCucumberResultFromFilePath(
            processResult,
            cucumberRunConfiguration.jsonResultFilePath,
            cucumberRunConfiguration,
            startTime,
            new Date()
        );
    }
}