import {ICollections} from "../collections/i-collections";
import {ICucumberRunConfiguration} from "./i-cucumber-run-configuration";
import {CucumberScenarioResult} from "./cucumber-scenario-result";
import {ICucumberScenarioResult} from "./i-cucumber-scenario-result";
import {ICucumberFeatureResult} from "./i-cucumber-feature-result";
import {ICucumberTag} from "./i-cucumber-tag";
import {CucumberTag} from "./cucumber-tag";
import {CucumberTestResult} from "./cucumber-test-result";
import {ICucumberTestResult} from "./i-cucumber-test-result";
import {IProcessResult} from "../node-js-wrappers/i-process-result";
import {IList} from "../collections/i-list";
import {CaseInsensitiveComparator} from "../collections/case-insensitive-comparator";
import {IProcess} from "../node-js-wrappers/i-process";
import {IConsole} from "../node-js-wrappers/i-console";
import {ICucumberRunner} from "./i-cucumber-runner";
import {CucumberRunner} from "./cucumber-runner";
import {IFileSystem} from "../node-js-wrappers/i-filesystem";
import {CucumberRunConfiguration} from "./cucumber-run-configuration";
import {CucumberFeatureResult} from "./cucumber-feature-result";
import {IJSONObject} from "../typed-json/i-json-object";
import {FeatureSet} from "./feature-set";
import {IErrors} from "../errors/i-errors";
import {IDictionary} from "../collections/i-dictionary";
import {ICucumber} from "./i-cucumber";
import {IFeatureSet} from "./i-feature-set";
import {FeatureSets} from "./feature-sets";
import {IFeatureSets} from "./i-feature-sets";
import {IFeatureSetConfiguration} from "./i-feature-set-configuration";
import {ICucumberConfiguration} from "./i-cucumber-configuration";
import {IExpectationWrapper} from "../chai/i-expectation-wrapper";
import {ExpectationWrapper} from "../chai/expectation-wrapper";
import {ChaiStatic} from "../chai/chai-static";
import {IPromiseFactory} from "../promise/i-promise-factory";
import {IJSONSerializer} from "../typed-json/i-json-serializer";
import {IPath} from "../node-js-wrappers/i-path";
import {CucumberCli} from "./cucumber-cli";

export class Cucumber implements ICucumber {
    constructor(
        private collections:ICollections,
        private fileSystem:IFileSystem,
        private cucumberConfig:ICucumberConfiguration,
        private errors:IErrors,
        private chai:ChaiStatic,
        private promiseFactory:IPromiseFactory,
        private jsonSerializer:IJSONSerializer,
        private path:IPath,
        private process:IProcess,
        private console:IConsole
    ) {}

    newCucumberCli():CucumberCli {
        return new CucumberCli(
            this.newCucumberRunner(this.process,this.console),
            this.cucumberConfig,
            this.path,
            this,
            this.fileSystem,
            this.console
        );
    }

    get world():Function {
        const timeout = this.cucumberConfig.defaultCucumberStepTimeoutMS;
        return function setupCucumberWorldObject() {
            this.setDefaultTimeout(
                timeout
            );
        }
    }

    newExpectationWrapper():IExpectationWrapper {
        return new ExpectationWrapper(
            this.cucumberConfig,
            this.chai,
            this.promiseFactory
        )
    }

    newFeatureSet(featureSetConfig:IFeatureSetConfiguration, featureSets:IFeatureSets):IFeatureSet {
        return new FeatureSet(
            featureSetConfig, 
            this.collections, 
            featureSets, 
            this.jsonSerializer
        );
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

    newCucumberTestResult(cucumberFeatureResults:IList<ICucumberFeatureResult>, processResult:IProcessResult, cucumberRunConfiguration:ICucumberRunConfiguration, resultAcquisitionError:Error, startTime:Date, endTime:Date, passFailOverrideForWhenProcessResultUnavailable?:boolean):ICucumberTestResult {
        return new CucumberTestResult(
            cucumberFeatureResults,
            processResult,
            CaseInsensitiveComparator,
            cucumberRunConfiguration,
            resultAcquisitionError,
            this.errors,
            startTime,
            endTime,
            this.jsonSerializer,
            passFailOverrideForWhenProcessResultUnavailable
        );
    }

    newCucumberRunner(process:IProcess, console:IConsole):ICucumberRunner {
        return new CucumberRunner(
            process,
            console,
            this,
            this.cucumberConfig,
            this.collections
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
        return this.newFeatureSets(
            this.collections.newList(this.cucumberConfig.featureSets)
        );
    }

    newFeatureSets(featureSetConfigurations:IList<IFeatureSetConfiguration>):IFeatureSets {
        return new FeatureSets(
            featureSetConfigurations,
            this
        );
    }

    newCucumberResultFromFilePath(processResult:IProcessResult, cucumberJSONFilePath:string, cucumberRunConfiguration:ICucumberRunConfiguration, startTime:Date, endTime:Date):ICucumberTestResult {
        return this.loadCucumberResult(processResult, cucumberJSONFilePath, cucumberRunConfiguration, startTime, endTime, null);
    }

    private loadCucumberResult(processResult:IProcessResult, cucumberJSONFilePath:string, cucumberRunConfiguration:ICucumberRunConfiguration, startTime:Date, endTime:Date, passFailOverrideForWhenProcessResultUnavailable?:boolean):ICucumberTestResult {
        var cucumberFeatureResults = null;
        var resultAcquisitionError = null;
        try {
            const rawCucumberResultJSON = this.fileSystem.readJSONArrayFileSync(cucumberJSONFilePath);
            cucumberFeatureResults = rawCucumberResultJSON.map(
                featureJSON => this.newCucumberFeatureResult(featureJSON)
            );
        }
        catch(e) {
            resultAcquisitionError = e.toString();
        }
        return this.newCucumberTestResult(
            cucumberFeatureResults,
            processResult,
            cucumberRunConfiguration,
            resultAcquisitionError,
            startTime,
            endTime,
            passFailOverrideForWhenProcessResultUnavailable
        );
    }

    newCucumberResultFromFilePathWhenProcessResultUnavailable(cucumberJSONFilePath:string, passFailOverrideForWhenProcessResultUnavailable:boolean):ICucumberTestResult {
        const cucumberRunConfiguration:ICucumberRunConfiguration = {
            cucumberAdditionalArgs: '',
            isDryRun: false,
            jsonResultFilePath: cucumberJSONFilePath,
            environmentVariables: {}
        };
        const timestamp = new Date();
        return this.loadCucumberResult(null, cucumberJSONFilePath, cucumberRunConfiguration, timestamp, timestamp, passFailOverrideForWhenProcessResultUnavailable);
    }
}
