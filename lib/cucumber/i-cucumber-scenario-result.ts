import IList from "../collections/i-list";
import ICucumberTag from "./i-cucumber-tag";

interface ICucumberScenarioResult {
    tags():IList<ICucumberTag>;
}

export default ICucumberScenarioResult;