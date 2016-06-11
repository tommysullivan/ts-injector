import ICollections from "../collections/i-collections";
import ICucumberRunConfiguration from "./i-cucumber-run-configuration";
import CucumberScenarioResult from "./cucumber-scenario-result";
import ICucumberScenarioResult from "./i-cucumber-scenario-result";
import ICucumberFeatureResult from "./i-cucumber-feature-result";
import ICucumberTag from "./i-cucumber-tag";
import CucumberTag from "./cucumber-tag";
import CucumberTestResult from "./cucumber-test-result";
import ICucumberTestResult from "./i-cucumber-test-result";
import IProcessResult from "../node-js-wrappers/i-process-result";
import IList from "../collections/i-list";
import CaseInsensitiveComparator from "../collections/case-insensitive-comparator";
import IProcess from "../node-js-wrappers/i-process";
import IConsole from "../node-js-wrappers/i-console";
import ICucumberRunner from "./i-cucumber-runner";
import CucumberRunner from "./cucumber-runner";
import IFileSystem from "../node-js-wrappers/i-filesystem";
import CucumberRunConfiguration from "./cucumber-run-configuration";
import CucumberFeatureResult from "./cucumber-feature-result";
import CucumberConfiguration from "./cucumber-configuration";
import IJSONObject from "../typed-json/i-json-object";
import FeatureSet from "./feature-set";
import IErrors from "../errors/i-errors";
import IDictionary from "../collections/i-dictionary";
import ICucumber from "./i-cucumber";
import IFeatureSet from "./i-feature-set";
import FeatureSets from "./feature-sets";
import IFeatureSets from "./i-feature-sets";

export default class Cucumber implements ICucumber {
    private collections:ICollections;
    private fileSystem:IFileSystem;
    private cucumberConfig:CucumberConfiguration;
    private errors:IErrors;

    constructor(collections:ICollections, fileSystem:IFileSystem, cucumberConfig:CucumberConfiguration, errors:IErrors) {
        this.collections = collections;
        this.fileSystem = fileSystem;
        this.cucumberConfig = cucumberConfig;
        this.errors = errors;
    }

    get world():Function {
        var timeout = this.cucumberConfig.defaultCucumberStepTimeoutMS;
        return function setupCucumberWorldObject() {
            this.setDefaultTimeout(timeout);
        }
    }

    newFeatureSet(configJSON:IJSONObject, featureSets:IFeatureSets):IFeatureSet {
        return new FeatureSet(configJSON, this.collections, featureSets);
    }

    newCucumberRunConfiguration(isDryRun:boolean, jsonResultFilePath:string, cucumberAdditionalArgs:string, envVariables:IDictionary<string>):ICucumberRunConfiguration {
        return new CucumberRunConfiguration(
            envVariables,
            cucumberAdditionalArgs,
            isDryRun,
            'node_modules/cucumber/bin/cucumber.js',
            jsonResultFilePath
        );
    }

    newCucumberScenarioResult(resultJSON:IJSONObject):ICucumberScenarioResult {
        return new CucumberScenarioResult(resultJSON, this);
    }

    newCucumberFeatureResult(rawCucumberFeatureJSON:IJSONObject):ICucumberFeatureResult {
        return new CucumberFeatureResult(rawCucumberFeatureJSON, this.collections, this);
    }

    newCucumberTag(tagJSON:IJSONObject):ICucumberTag {
        return new CucumberTag(tagJSON);
    }

    newCucumberTestResult(cucumberFeatureResults:IList<ICucumberFeatureResult>, processResult:IProcessResult, cucumberRunConfiguration:ICucumberRunConfiguration, resultAcquisitionError:Error, startTime:Date, endTime:Date):ICucumberTestResult {
        return new CucumberTestResult(
            cucumberFeatureResults,
            processResult,
            CaseInsensitiveComparator,
            cucumberRunConfiguration,
            resultAcquisitionError,
            this.errors,
            startTime,
            endTime
        );
    }

    newCucumberRunner(process:IProcess, console:IConsole):ICucumberRunner {
        return new CucumberRunner(
            process,
            console,
            this.fileSystem,
            this.collections,
            this,
            this.cucumberConfig
        );
    }

    getListOfStringsFromTable(table:any):IList<string> {
        return this.collections.newList<string>(table.rows().map(r=>r[0]));
    }

    newManualStep(numberOfArgs:number):(...args:Array<any>)=>void {
        return [
            ()=>null,
            (a)=>null,
            (a,b)=>null,
            (a,b,c)=>null,
            (a,b,c,d)=>null
        ][numberOfArgs];
    }

    get featureSets():IFeatureSets {
        return this.newFeatureSets(this.cucumberConfig.featureSetsJSONArray);
    }

    newFeatureSets(featureSetsJSONArray:IList<IJSONObject>):IFeatureSets {
        return new FeatureSets(featureSetsJSONArray, this);
    }
}
