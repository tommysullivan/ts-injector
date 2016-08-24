import IProcess from "../node-js-wrappers/i-process";
import IFileSystem from "../node-js-wrappers/i-filesystem";
import IThenable from "../promise/i-thenable";
import ICucumberTestResult from "./i-cucumber-test-result";
import IConsole from "../node-js-wrappers/i-console";
import ICucumberRunConfiguration from "./i-cucumber-run-configuration";
import ICucumberRunner from "./i-cucumber-runner";
import ICollections from "../collections/i-collections";
import IProcessResult from "../node-js-wrappers/i-process-result";
import Cucumber from "./cucumber";
import CucumberConfiguration from "./cucumber-configuration";

export default class CucumberRunner implements ICucumberRunner {
    private process:IProcess;
    private console:IConsole;
    private fileSystem:IFileSystem;
    private collections:ICollections;
    private cucumber:Cucumber;
    private cucumberConfig:CucumberConfiguration;

    constructor(process:IProcess, console:IConsole, fileSystem:IFileSystem, collections:ICollections, cucumber:Cucumber, cucumberConfig:CucumberConfiguration) {
        this.process = process;
        this.console = console;
        this.fileSystem = fileSystem;
        this.collections = collections;
        this.cucumber = cucumber;
        this.cucumberConfig = cucumberConfig;
    }

    runCucumber(cucumberRunConfiguration:ICucumberRunConfiguration):IThenable<ICucumberTestResult> {
        const startTime = new Date();
        const additionalArgs = `${cucumberRunConfiguration.cucumberAdditionalArgs()}${cucumberRunConfiguration.isDryRun() ? ' --dry-run' : ''}`;
        const runCucumberCommand = [
            this.cucumberConfig.cucumberExecutablePath(),
            additionalArgs,
            `-f json:${cucumberRunConfiguration.jsonResultFilePath()}`
        ].join(' ');

        this.console.log('cucumber command: ', runCucumberCommand);
        this.console.log(
            'environment variables: ',
            cucumberRunConfiguration.environmentVariables().toJSONString()
        );

        return this.process.executeNodeProcess(runCucumberCommand, cucumberRunConfiguration.environmentVariables())
            .then(
                r => this.onCucumberProcessComplete(r, cucumberRunConfiguration, startTime),
                r => this.onCucumberProcessComplete(r, cucumberRunConfiguration, startTime)
            );
    }

    private onCucumberProcessComplete(processResult:IProcessResult, cucumberRunConfiguration:ICucumberRunConfiguration, startTime:Date):ICucumberTestResult {
        const endTime = new Date();
        return this.constructResult(processResult, cucumberRunConfiguration, startTime, endTime);
    }

    private constructResult(processResult:IProcessResult, cucumberRunConfiguration:ICucumberRunConfiguration, startTime:Date, endTime:Date):ICucumberTestResult {
        var cucumberFeatureResults = null;
        var resultAcquisitionError = null;
        try {
            const rawCucumberResultJSON = this.fileSystem.readJSONArrayFileSync(
                cucumberRunConfiguration.jsonResultFilePath()
            );
            cucumberFeatureResults = rawCucumberResultJSON.map(
                featureJSON => this.cucumber.newCucumberFeatureResult(featureJSON)
            );
        }
        catch(e) {
            resultAcquisitionError = e.toString();
        }
        return this.cucumber.newCucumberTestResult(cucumberFeatureResults, processResult, cucumberRunConfiguration, resultAcquisitionError, startTime, endTime);
    }
}