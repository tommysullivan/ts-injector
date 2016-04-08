import IList from "../collections/i-list";
import ICucumberFeatureResult from "./i-cucumber-feature-result";
import IProcessResult from "../node-js-wrappers/i-process-result";

interface ICucumberTestResult {
    toJSON():any;
    toJSONString():string;
    toString():string;
    uniqueTagNames():IList<string>;
    consoleOutput():string;
    processResult:IProcessResult;
}

export default ICucumberTestResult;