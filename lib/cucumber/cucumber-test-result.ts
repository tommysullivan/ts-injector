import ICucumberTestResult from "./i-cucumber-test-result";
import ICucumberFeatureResult from "./i-cucumber-feature-result";
import IList from "../collections/i-list";
import IProcessResult from "../node-js-wrappers/i-process-result";
import IComparator from "../collections/i-comparator";
import ICucumberRunConfiguration from "./i-cucumber-run-configuration";
import IErrors from "../errors/i-errors";

export default class CucumberTestResult implements ICucumberTestResult {
    private _cucumberFeatureResults:IList<ICucumberFeatureResult>;
    private _processResult:IProcessResult;
    private caseInsensitiveComparator:IComparator<string>;
    private cucumberRunConfig:ICucumberRunConfiguration;
    private resultAcquisitionError:Error;
    private errors:IErrors;
    private startTime:Date;
    private endTime:Date;

    constructor(cucumberFeatureResults:IList<ICucumberFeatureResult>, processResult:IProcessResult, caseInsensitiveComparator:IComparator<string>, cucumberRunConfig:ICucumberRunConfiguration, resultAcquisitionError:Error, errors:IErrors, startTime:Date, endTime:Date) {
        this._cucumberFeatureResults = cucumberFeatureResults;
        this._processResult = processResult;
        this.caseInsensitiveComparator = caseInsensitiveComparator;
        this.cucumberRunConfig = cucumberRunConfig;
        this.resultAcquisitionError = resultAcquisitionError;
        this.errors = errors;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    uniqueTagNames():IList<string> {
        try {
            return this._cucumberFeatureResults
                .flatMap(c=>c.uniqueTagNames())
                .unique()
                .sortWith(this.caseInsensitiveComparator);
        }
        catch(e) {
            throw this.errors.newErrorWithCause(e, `Could not retrieve tags due to error obtaining or traversing the test result. Details: ${this.toString()}`);
        }
    }

    get processResult():IProcessResult { return this._processResult; }

    consoleOutput():string {
        return this.processResult.stdoutLines().join("\n");
    }

    toJSON():any {
        return {
            cucumberFeatureResults: this._cucumberFeatureResults ? this._cucumberFeatureResults.map(c=>c.toJSON()) : null,
            processResult: this.processResult.toJSON(),
            cucumberRunConfig: this.cucumberRunConfig.toJSON(),
            resultAcquisitionError: this.resultAcquisitionError,
            startTime: this.startTime.getTime(),
            endTime: this.endTime.getTime()
        }
    }

    toJSONString():string {
        return JSON.stringify(this.toJSON(), null, 3);
    }

    toString():string {
        return this.toJSONString();
    }
}