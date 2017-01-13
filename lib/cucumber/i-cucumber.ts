import {IFeatureSet} from "./i-feature-set";
import {IJSONObject} from "../typed-json/i-json-object";
import {ICucumberRunConfiguration} from "./i-cucumber-run-configuration";
import {IDictionary} from "../collections/i-dictionary";
import {ICucumberScenarioResult} from "./i-cucumber-scenario-result";
import {ICucumberFeatureResult} from "./i-cucumber-feature-result";
import {ICucumberTag} from "./i-cucumber-tag";
import {ICucumberTestResult} from "./i-cucumber-test-result";
import {IList} from "../collections/i-list";
import {IProcessResult} from "../node-js-wrappers/i-process-result";
import {ICucumberRunner} from "./i-cucumber-runner";
import {IProcess} from "../node-js-wrappers/i-process";
import {IFeatureSets} from "./i-feature-sets";
import {IConsole} from "../console/i-console";
import {IFeatureSetConfiguration} from "./i-feature-set-configuration";
import {IExpectationWrapper} from "../chai/i-expectation-wrapper";
import {IFuture} from "../futures/i-future";
import {CucumberCli} from "./cucumber-cli";

export interface ICucumber {
    newCucumberCli():CucumberCli;
    world:Function;
    newFeatureSet(featureSetConfig:IFeatureSetConfiguration, featureSets:IFeatureSets):IFeatureSet;
    newCucumberScenarioResult(resultJSON:IJSONObject):ICucumberScenarioResult;
    newCucumberFeatureResult(rawCucumberFeatureJSON:IJSONObject):ICucumberFeatureResult;
    newCucumberTag(tagJSON:IJSONObject):ICucumberTag;
    newCucumberRunner(process:IProcess, console:IConsole):ICucumberRunner;
    getListOfStringsFromTable(table:any):IList<string>;
    newManualStep(numberOfArgs:number):(...args:Array<any>)=>void;
    newFeatureSets(featureSetConfigurations:IList<IFeatureSetConfiguration>):IFeatureSets;
    featureSets:IFeatureSets;
    newExpectationWrapper():IExpectationWrapper;

    newCucumberTestResult(
        cucumberFeatureResults:IList<ICucumberFeatureResult>,
        processResult:IProcessResult,
        cucumberRunConfiguration:ICucumberRunConfiguration,
        resultAcquisitionError:Error,
        startTime:Date,
        endTime:Date,
        passFailOverrideForWhenProcessResultUnavailable?:boolean
    ):ICucumberTestResult;

    newCucumberRunConfiguration(
        isDryRun:boolean,
        jsonResultFilePath:string,
        cucumberAdditionalArgs:string,
        envVariables:IDictionary<string>
    ):ICucumberRunConfiguration;

    newCucumberResultFromFilePathWhenProcessResultUnavailable(
        cucumberJSONFilePath:string,
        passFailOverrideForWhenProcessResultUnavailable:boolean
    ):ICucumberTestResult;

    newCucumberResultFromFilePath(
        processResult:IProcessResult,
        cucumberJSONFilePath:string,
        cucumberRunConfiguration:ICucumberRunConfiguration,
        startTime:Date,
        endTime:Date
    ):ICucumberTestResult;
}