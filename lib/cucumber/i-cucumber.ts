import IFeatureSet from "./i-feature-set";
import IJSONObject from "../typed-json/i-json-object";
import ICucumberRunConfiguration from "./i-cucumber-run-configuration";
import IDictionary from "../collections/i-dictionary";
import ICucumberScenarioResult from "./i-cucumber-scenario-result";
import ICucumberFeatureResult from "./i-cucumber-feature-result";
import ICucumberTag from "./i-cucumber-tag";
import ICucumberTestResult from "./i-cucumber-test-result";
import IList from "../collections/i-list";
import IProcessResult from "../node-js-wrappers/i-process-result";
import ICucumberRunner from "./i-cucumber-runner";
import IConsole from "../node-js-wrappers/i-console";
import IProcess from "../node-js-wrappers/i-process";
import IFeatureSets from "./i-feature-sets";

interface ICucumber {
    world:Function;
    newFeatureSet(configJSON:IJSONObject, featureSets:IFeatureSets):IFeatureSet;
    newCucumberScenarioResult(resultJSON:IJSONObject):ICucumberScenarioResult;
    newCucumberFeatureResult(rawCucumberFeatureJSON:IJSONObject):ICucumberFeatureResult;
    newCucumberTag(tagJSON:IJSONObject):ICucumberTag;
    newCucumberRunner(process:IProcess, console:IConsole):ICucumberRunner;
    getListOfStringsFromTable(table:any):IList<string>;
    newManualStep(numberOfArgs:number):(...args:Array<any>)=>void;
    newFeatureSets(featureSetsJSONArray:IList<IJSONObject>):IFeatureSets;
    featureSets:IFeatureSets;

    newCucumberTestResult(
        cucumberFeatureResults:IList<ICucumberFeatureResult>,
        processResult:IProcessResult,
        cucumberRunConfiguration:ICucumberRunConfiguration,
        resultAcquisitionError:Error,
        startTime:Date,
        endTime:Date
    ):ICucumberTestResult;

    newCucumberRunConfiguration(
        isDryRun:boolean,
        jsonResultFilePath:string,
        cucumberAdditionalArgs:string,
        envVariables:IDictionary<string>
    ):ICucumberRunConfiguration;
}
export default ICucumber;