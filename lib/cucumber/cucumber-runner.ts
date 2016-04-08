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
        var additionalArgs = cucumberRunConfiguration.cucumberAdditionalArgs();
        if (cucumberRunConfiguration.isDryRun()) additionalArgs += ' --dry-run';

        var runCucumberCommand = [
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
            .then((r) => this.constructResult(r, cucumberRunConfiguration), (r) => this.constructResult(r, cucumberRunConfiguration));
    }

    private constructResult(processResult:IProcessResult, cucumberRunConfiguration:ICucumberRunConfiguration):ICucumberTestResult {
        var cucumberFeatureResults = null;
        var resultAcquisitionError = null;
        try {
            var rawCucumberResultJSON = this.fileSystem.readJSONArrayFileSync(
                cucumberRunConfiguration.jsonResultFilePath()
            );
            cucumberFeatureResults = rawCucumberResultJSON.map(
                featureJSON => this.cucumber.newCucumberFeatureResult(featureJSON)
            );
        }
        catch(e) {
            resultAcquisitionError = e.toString();
        }
        return this.cucumber.newCucumberTestResult(cucumberFeatureResults, processResult, cucumberRunConfiguration, resultAcquisitionError);
    }

    //runCucumber(cucumberRunConfiguration:ICucumberRunConfiguration):IThenable<ICucumberTestResult> {
    //    var env = cucumberRunConfiguration.environmentVariables();
    //    var nodeExecutable = this.process.pathToNodeJSExecutable();
    //    env.add('PATH', nodeExecutable);
    //    var runCucumberCommand = [
    //        nodeExecutable,
    //        cucumberRunConfiguration.cucumberExecutablePath(),
    //        cucumberRunConfiguration.cucumberAdditionalArgs(),
    //        `-f json:${cucumberRunConfiguration.jsonResultFilePath()}`
    //    ].join(' ');
    //    return this.process.executeNodeProcess(runCucumberCommand, env)
    //        .then(processResult => this.api.newCucumberTestResult());
    //        //{
    //        //    return this.api.newCucumberTestResult();
    //        //    var resultJSON = [];
    //        //    var jsonResultError = null;
    //        //    try {
    //        //        resultJSON = this.fileSystem.readJSONFileSync(jsonPath);
    //        //    }
    //        //    catch(e) {
    //        //        jsonResultError = e;
    //        //    }
    //        //
    //        //})
    //}

    //runClusterTest(cucumberRunConfig:any, cucumberAdditionalArgs:string, features:IList<string>):IThenable<IClusterTestResult> {
    //    var environmentVariables = {
    //        clusterId: cucumberRunConfig.clusterId,
    //        phase: cucumberRunConfig.phase
    //    }
    //    var featuresPlusAdditionalArgs = `${features.join(' ')} ${cucumberAdditionalArgs}`;
    //    var repositories = this.api.newRepositories(cucumberRunConfig.phase);
    //    function newClusterTestResult(cucumberTestResult, versionGraph, versionGraphError) {
    //        return this.api.newClusterTestResult(
    //            cucumberTestResult.resultJSON(),
    //            cucumberTestResult.stdout(),
    //            cucumberTestResult.stderr(),
    //            cucumberTestResult.processExitCode(),
    //            cucumberRunConfig,
    //            versionGraph,
    //            versionGraphError
    //        );
    //    }
    //    return this.runCucumber(cucumberRunConfig.jsonResultFilePath, environmentVariables, featuresPlusAdditionalArgs)
    //        .then(cucumberTestResult => {
    //            var clusterUnderTest = this.api.newClusterUnderTest(cucumberRunConfig.clusterId, repositories);
    //            return clusterUnderTest.versionGraph()
    //                .then(versionGraph=>newClusterTestResult(cucumberTestResult, versionGraph, null))
    //                .catch(error=>newClusterTestResult(cucumberTestResult, null, error));
    //        });
    //}
}