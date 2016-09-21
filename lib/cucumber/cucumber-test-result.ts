import {ICucumberTestResult} from "./i-cucumber-test-result";
import {ICucumberFeatureResult} from "./i-cucumber-feature-result";
import {IList} from "../collections/i-list";
import {IProcessResult} from "../node-js-wrappers/i-process-result";
import {IComparator} from "../collections/i-comparator";
import {ICucumberRunConfiguration} from "./i-cucumber-run-configuration";
import {IErrors} from "../errors/i-errors";
import {IJSONSerializer} from "../typed-json/i-json-serializer";

export class CucumberTestResult implements ICucumberTestResult {
    constructor(
        private cucumberFeatureResults:IList<ICucumberFeatureResult>,
        private processResult:IProcessResult,
        private caseInsensitiveComparator:IComparator<string>,
        private cucumberRunConfig:ICucumberRunConfiguration,
        private resultAcquisitionError:Error,
        private errors:IErrors,
        private startTime:Date,
        private endTime:Date,
        private jsonSerializer:IJSONSerializer
    ) {}

    get uniqueTagNames():IList<string> {
        try {
            return this.cucumberFeatureResults
                .flatMap(c=>c.uniqueTagNames)
                .unique
                .sortWith(this.caseInsensitiveComparator);
        }
        catch(e) {
            throw this.errors.newErrorWithCause(
                e,
                `Could not retrieve tags due to error obtaining or traversing the test result. Details: ${this.toString()}`
            );
        }
    }

    get consoleOutput():string {
        return this.processResult
            ? this.processResult.allOutputLines.join("\n")
            : 'Raw process output unavailable';
    }

    get passed():boolean {
        return !this.processResult.hasError;
    }

    toJSON():any {
        return {
            cucumberFeatureResults: this.jsonSerializer.serialize(this.cucumberFeatureResults),
            processResult: this.jsonSerializer.serialize(this.processResult),
            cucumberRunConfig: this.jsonSerializer.serialize(this.cucumberRunConfig),
            resultAcquisitionError: this.resultAcquisitionError,
            startTime: this.startTime.getTime(),
            endTime: this.endTime.getTime()
        }
    }

    toString():string {
        return JSON.stringify(this.toJSON(), null, 3);
    }
}